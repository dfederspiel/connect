import {
  ApolloServer,
  AuthenticationError,
  gql,
  IMocks,
  IResolvers,
} from 'apollo-server-express';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';
import UserDataContext from './data/UserDataContext';
import UserDataSource from './datasources/UsersDataSource';
import AffirmationsResolvers, {
  AffirmationsTypeDefs,
} from './resolvers/AffirmationsResolvers';
import UsersResolvers, { UsersTypeDefs } from './resolvers/UsersResolvers';
import { IPubSub } from './lib/types';
import { PrismaClient } from '@prisma/client';
import { DocumentNode } from 'graphql/language';
import { AuthContext } from '@lib/auth/AuthContext';

const rootTypeDefs = gql`
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
  client: PrismaClient;
  typeDefs: Array<DocumentNode>;
  resolvers: IResolvers[];
  pubsub: IPubSub;
  datasources: DataSources<IDataSources>;
  mocks: IMocks | boolean;
  private dataContext: UserDataContext;
  private authContext: AuthContext;

  constructor(pubsub: IPubSub, mocks: IMocks | boolean) {
    this.pubsub = pubsub;
    this.client = new PrismaClient();
    this.dataContext = new UserDataContext(this.client);
    this.authContext = new AuthContext(this.dataContext);
    this.datasources = {
      userApi: new UserDataSource(new UserDataContext(this.client)),
    };
    this.mocks = mocks;
    this.typeDefs = [AffirmationsTypeDefs, UsersTypeDefs];
    this.resolvers = [
      new AffirmationsResolvers(pubsub).resolvers,
      new UsersResolvers().resolvers,
    ] as any; // TODO: fix types
  }

  server(): ApolloServer {
    return new ApolloServer({
      typeDefs: [rootTypeDefs, ...this.typeDefs],
      resolvers: this.resolvers,
      dataSources: () => this.datasources,
      introspection: true,
      mocks: this.mocks,
      context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // get the user token from the headers
          const token = req?.headers?.authorization?.split(' ')[1];
          let user;
          if (token) {
            try {
              //console.info("[ACCESS TOKEN]", token)
              const decoded = await this.authContext.decode(token);
              console.log('[TOKEN INFO]', decoded, token);
              user = await this.authContext.getUser(decoded);
              //console.log('[USER CONTEXT]', user)
            } catch (ex) {
              //console.error("[X0001]", ex.message);
              //throw new AuthenticationError("you must be logged in");
            }
          }

          // optionally block the user
          // we could also check user roles/permissions here
          if (!user) throw new AuthenticationError('you must be logged in');

          // add the user to the context
          return { user };
        }
      },
      subscriptions: {
        onConnect: async (connectionParams: any, webSocket) => {
          let user;
          try {
            if (connectionParams.authToken !== null) {
              console.log('[TOKEN INFO]', connectionParams.authToken);
              const decoded = await this.authContext.decode(connectionParams.authToken);
              console.log('[TOKEN INFO]', decoded, connectionParams.authToken);
              user = await this.authContext.getUser(decoded);
              return {
                user: user,
              };
            }
          } catch (ex) {
            console.error(ex);
          }
          return {
            currentUser: null,
          };
        },
      },
    });
  }
}
