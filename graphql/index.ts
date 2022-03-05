import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import GraphQLServer from './src/server';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { DataMocks } from './__mocks__/mocks';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { test } from '@lib/tools';
import { WebSocketServer } from 'ws';
import { IMocks } from '@graphql-tools/mock';

import { rootTypeDefs } from './src/server';
import { AffirmationsTypeDefs } from './src/resolvers/AffirmationsResolvers';
import { UsersTypeDefs } from './src/resolvers/UsersResolvers';
import resolvers from './src/resolvers';
import { ApolloServer } from 'apollo-server-express';
import { ArticlesTypeDefs } from './src/resolvers/ArticlesResolvers';
import { User } from '@prisma/client';

// import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
// export const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: () => 'world',
//       },
//     },
//   }),
//   subscription: new GraphQLObjectType({
//     name: 'Subscription',
//     fields: {
//       greetings: {
//         type: GraphQLString,
//         subscribe: async function* (a, b, c) {
//           console.log('SUBSCRIPTION', a, b, c);
//           for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
//             yield { greetings: hi };
//           }
//         },
//       },
//     },
//   }),
// });

console.log(test('GRAPHQL'));
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

  const mocks: boolean | IMocks = process.env.USE_MOCKS === 'true' ? DataMocks : false;

  const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, AffirmationsTypeDefs, ArticlesTypeDefs, UsersTypeDefs],
    resolvers: resolvers(pubsub),
  });
  const graphQlServer = new GraphQLServer(schema, pubsub, mocks);
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

          if (!user && process.env.NODE_ENV === 'development') {
            user = {
              id: 1,
              domain: 'federnet.com',
              email: 'david@federnet.com',
            } as User;
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
