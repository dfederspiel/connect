import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import UserDataContext from './data/UserDataContext';
import UserDataSource from './datasources/UsersDataSource';
import { IMocks } from '@graphql-tools/mock';
import { IPubSub } from './lib/types';
import { PrismaClient, User } from '@prisma/client';
import { AuthContext } from '@lib/auth/AuthContext';
import { GraphQLSchema } from 'graphql/type/schema';
import ArticlesDataSource from './datasources/ArticlesDataSource';

export const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;
interface IDataSources {
  userApi: UserDataSource;
}
export default class GraphQLServer {
  schema: GraphQLSchema;
  client: PrismaClient;
  pubsub: IPubSub;
  datasources: DataSources<IDataSources>;
  mocks: IMocks | boolean;
  private dataContext: UserDataContext;
  authContext: AuthContext;

  constructor(
    schema: GraphQLSchema,
    pubsub: IPubSub,
    mocks: IMocks | boolean,
    client?: PrismaClient,
  ) {
    this.pubsub = pubsub;
    this.client = client || new PrismaClient();
    this.dataContext = new UserDataContext(this.client);
    this.authContext = new AuthContext(this.dataContext);
    this.datasources = {
      userApi: new UserDataSource(new UserDataContext(this.client)),
      articles: new ArticlesDataSource(this.client),
    };
    this.mocks = mocks;
    // this.typeDefs = [AffirmationsTypeDefs, UsersTypeDefs];
    // this.resolvers = [
    //   new AffirmationsResolvers(pubsub).resolvers,
    //   new UsersResolvers().resolvers,
    // ] as any; // TODO: fix types
    this.schema = schema;
  }

  server(): ApolloServer {
    return new ApolloServer({
      schema: this.schema,
      dataSources: () => this.datasources,
      introspection: true,
      mocks: this.mocks,
      context: async ({
        req,
      }): Promise<{
        user: User;
      }> => {
        // get the user token from the headers
        console.log('ADDING CONTEXT FOR POST');
        const token = req?.headers?.authorization?.split(' ')[1];
        let user;
        if (token) {
          try {
            const decoded = await this.authContext.decode(token);
            user = await this.authContext.getUser(decoded);
          } catch (ex) {
            console.error('[X0001]', ex);
          }
        }

        // optionally block the user
        // we could also check user roles/permissions here
        if (process.env.NODE_ENV === 'production')
          if (!user) throw new AuthenticationError('you must be logged in');

        if (!token && process.env.NODE_ENV === 'development') {
          user = {
            id: 1,
            domain: 'federnet.com',
            email: 'david@federnet.com',
          } as User;
        }

        console.log('USER CONTEXT', user);
        // add the user to the context
        return { user };
      },
    });
  }
}
