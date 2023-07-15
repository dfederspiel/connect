import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import GraphQLServer from './src/server';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';

import { rootTypeDefs } from './src/server';
import { AffirmationsTypeDefs } from './src/resolvers/AffirmationsResolvers';
import { UsersTypeDefs } from './src/resolvers/UsersResolvers';
import resolvers from './src/resolvers';

(async () => {
  const port = process.env.PORT || 4000;

  const app = express();
  app.use(cors());

  const httpServer = createServer(app);
  const pubsub = new RedisPubSub({
    connection: {
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
      retry_strategy: (options: { attempt: number }) => {
        return Math.max(options.attempt * 100, 3000);
      },
    },
  });

  const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, AffirmationsTypeDefs, UsersTypeDefs],
    resolvers: resolvers(pubsub),
  });
  const graphQlServer = new GraphQLServer(schema, pubsub, false);
  const apollo = graphQlServer.server();
  await apollo.start();

  apollo.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: '*',
    },
  });

  httpServer.listen(port, () => {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    useServer(
      {
        schema,
        context: async (ctx) => {
          const token = ctx?.connectionParams?.authorization as string | undefined;
          let user;
          if (token) {
            try {
              const decoded = await graphQlServer.authContext.decode(token);
              user = await graphQlServer.authContext.getUser(decoded);
            } catch (ex) {
              console.error('[X0001]', ex);
            }
          }
          return {
            user,
            dataSources: graphQlServer.datasources,
          };
        },
      },
      wsServer,
    );
    console.log(
      `GraphQL Playground ready at http://localhost:${port}${apollo.graphqlPath}`,
    );
  });
})();
