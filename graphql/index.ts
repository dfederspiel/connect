import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
// import GraphQLServer, { IDataSources } from './src/server';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';

import { PrismaClient, User } from '@prisma/client';

import { typeDefs } from './src/schema/typeDefs.generated';
import { resolvers } from './src/schema/resolvers.generated';
import { ApolloServer } from 'apollo-server-express';
import UserDataContext from '@lib/auth/UserDataContext';
import { AuthContext } from '@lib/auth/AuthContext';
import UserDataSource from 'src/datasources/UsersDataSource';

export interface IDataSources {
  userApi: UserDataSource;
}

export interface ApolloContext {
  pubsub: RedisPubSub;
  user: User;
  dataSources: IDataSources;
}

(async () => {
  const port = process.env.PORT || 4000;

  const app = express();
  app.use(cors());

  const httpServer = createServer(app);

  const pubsub = new RedisPubSub({
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
      retryStrategy: (attempt) => {
        return Math.max(attempt * 100, 3000);
      },
    },
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // const graphQlServer = new GraphQLServer(schema, pubsub, false);
  const graphQlServer = new ApolloServer<ApolloContext>({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
  });
  // const apollo = graphQlServer.server();
  // await apollo.start();

  // apollo.applyMiddleware({
  //   app,
  //   cors: {
  //     credentials: true,
  //     origin: '*',
  //   },
  // });
  const client = new PrismaClient();
  const dataContext = new UserDataContext(client);
  const authContext = new AuthContext(dataContext);

  const dataSources = {
    userApi: new UserDataSource(new UserDataContext(client)),
  };

  httpServer.listen(port, () => {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    wsServer.on('close', () => {
      console.log('CONNECTION CLOSED');
    });

    useServer(
      {
        schema,
        context: async (ctx) => {
          const token = ctx?.connectionParams?.authorization as string | undefined;
          let user;
          if (token) {
            try {
              const decoded = await authContext.decode(token);
              user = await authContext.getUser(decoded);
            } catch (ex) {
              console.error('[X0001]', ex);
            }
          }
          return {
            pubsub,
            user,
            dataSources,
          };
        },
      },
      wsServer,
    );
    console.log(
      `GraphQL Playground ready at http://localhost:${port}${graphQlServer.graphqlPath}`,
    );
  });
})();
