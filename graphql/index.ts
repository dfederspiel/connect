import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';

import { PrismaClient } from '@prisma/client';

import { typeDefs } from './src/schema/typeDefs.generated';
import { resolvers } from './src/schema/resolvers.generated';
import { ApolloServer } from 'apollo-server-express';
import { AuthContext } from '@lib/auth/AuthContext';
import UserDataSource from 'src/datasources/UsersDataSource';
import { ApolloContext, ConnectionRef } from './src/lib/types';
import { checkAndUpdateConnectionRefCache, validateAndRetrieveUser } from './src/helpers';
import UserDataContext from './src/data/UserDataContext';

const CACHE_PURGE_INTERVAL = 5000; // 60 * 1000; // every 60 seconds

(async () => {
  let connections: ConnectionRef = {};
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

  const graphQlServer = new ApolloServer<ApolloContext>({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    introspection: true,
  });

  await graphQlServer.start();
  graphQlServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: '*',
    },
  });

  const client = new PrismaClient();
  const dataContext = new UserDataContext(client);
  const authContext = new AuthContext(dataContext);

  const dataSources = {
    userApi: new UserDataSource(new UserDataContext(client)),
  };

  const purgeStaleConnectionRefs = () => {
    const currentTime = Date.now();
    const filteredConnections = Object.entries(connections).filter(([, value]) => {
      return currentTime - value.updated <= 1 * 60 * 60 * 1000; // tokens less than 60 minutes TTL
    });
    connections = Object.fromEntries(filteredConnections);
  };

  httpServer.listen(port, () => {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    wsServer.on('close', () => {
      console.log('CONNECTION CLOSED');
    });

    setInterval(() => purgeStaleConnectionRefs(), CACHE_PURGE_INTERVAL);

    useServer(
      {
        schema,
        async onConnect(ctx) {
          ctx?.extra?.socket?.on('message', (data) => {
            const payload = JSON.parse(data.toString());
            const token = ctx?.connectionParams?.authorization as string | undefined;
            if (token && payload?.type === 'ping' && payload?.payload?.token) {
              const { connectionId, connectionRefs } = checkAndUpdateConnectionRefCache(
                token,
                payload,
                connections,
              );
              connections = connectionRefs;
              console.log('CONNECTIONS');
              for (const x in connections) {
                const y = connections[x];
                console.log(
                  `[${x}] hits: ${y.hits}\tswaps: ${y.swaps}\tage: ${
                    Date.now() - y.updated
                  }`,
                );
              }
              ctx?.extra?.socket?.send(
                JSON.stringify({
                  type: 'connection_ack',
                  payload: connections[connectionId],
                }),
              );
            }
          });

          const token = ctx?.connectionParams?.authorization as string | undefined;
          if (token) {
            const decoded = await authContext.decode(token);
            const user = await validateAndRetrieveUser(token, authContext, connections);
            if (!user && decoded.emails.length > 0)
              dataContext.createUser(decoded.emails[0]);
          }
        },
        onError: (ctx, message) => {
          console.log('ERROR', message);
        },
        context: async (ctx) => {
          const token = ctx?.connectionParams?.authorization as string | undefined;
          const user = await validateAndRetrieveUser(token, authContext, connections);

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

// async function validateAndRetrieveUser(
//   token: string | undefined,
//   authContext: AuthContext,
//   connections: ConnectionRef,
// ) {
//   if (token) {
//     const connectionId = crypto.createHash('sha1').update(token).digest('hex');
//     console.log('CONTEXT', connectionId);

//     if (!connections[connectionId]) {
//       connections[connectionId] = {
//         token,
//         hits: 0,
//         swaps: 0,
//         updated: Date.now(),
//       };
//     }

//     try {
//       const decoded = await authContext.decode(connections[connectionId].token);
//       const user = await authContext.getUser(decoded);
//       return user;
//     } catch (ex) {
//       console.error('[X0001]', ex);
//     }
//   }
// }

// function checkAndUpdateConnectionRefCache(
//   token: string,
//   message: { payload: { token: string } },
//   connectionRefs: ConnectionRef,
// ) {
//   const connectionId = crypto.createHash('sha1').update(token).digest('hex');
//   const newTokenHash = crypto
//     .createHash('sha1')
//     .update(message?.payload?.token)
//     .digest('hex');
//   if (connectionRefs[connectionId]) {
//     const connection = connectionRefs[connectionId];
//     connectionRefs[connectionId] = {
//       token: message?.payload?.token,
//       swaps: connectionId !== newTokenHash ? connection.swaps + 1 : connection.swaps,
//       hits: connection.hits + 1,
//       updated: connectionId === newTokenHash ? connection.updated : Date.now(),
//     };
//   }
//   return { connectionId, connectionRefs };
// }
