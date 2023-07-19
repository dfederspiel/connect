import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { useServer } from 'graphql-ws/lib/use/ws';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import crypto from 'crypto';

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

const CACHE_PURGE_INTERVAL = 60 * 1000; // every 60 seconds

let connections: Record<
  string,
  {
    token: string;
    hits: number;
    swaps: number;
    updated: number;
  }
> = {};

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

  httpServer.listen(port, () => {
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    wsServer.on('close', () => {
      console.log('CONNECTION CLOSED');
    });

    setInterval(() => {
      const currentTime = Date.now();
      const filteredConnections = Object.entries(connections).filter(([, value]) => {
        return currentTime - value.updated <= 1 * 60 * 60 * 1000;
      });

      connections = Object.fromEntries(filteredConnections);
    }, CACHE_PURGE_INTERVAL);

    useServer(
      {
        schema,
        onConnect(ctx) {
          ctx?.extra?.socket?.on('message', (data) => {
            const payload = JSON.parse(data.toString());
            const token = ctx?.connectionParams?.authorization as string | undefined;
            if (token && payload?.type === 'ping' && payload?.payload?.token) {
              console.log('PING WITH TOKEN');
              const connectionId = crypto.createHash('sha1').update(token).digest('hex');
              const newTokenHash = crypto
                .createHash('sha1')
                .update(payload?.payload?.token)
                .digest('hex');
              if (connections[connectionId]) {
                const x = connections[connectionId];
                connections[connectionId] = {
                  token: payload?.payload?.token,
                  swaps: connectionId !== newTokenHash ? x.swaps + 1 : x.swaps,
                  hits: x.hits + 1,
                  updated: connectionId === newTokenHash ? x.updated : Date.now(),
                };
                ctx?.extra?.socket?.send(
                  JSON.stringify({
                    type: 'connection_ack',
                    payload: connections[connectionId],
                  }),
                );
              } else {
                throw 'This should not happen';
              }
              for (const x in connections) {
                const y = connections[x];
                console.log(`hits:\t${y.hits}\nswaps:\t${y.swaps}\nhash:\t${x}\n\n`);
              }
            }
          });
        },
        onError: (ctx, message) => {
          console.log('ERROR', message);
        },
        context: async (ctx) => {
          const token = ctx?.connectionParams?.authorization as string | undefined;

          let user;
          if (token) {
            const connectionId = crypto.createHash('sha1').update(token).digest('hex');
            console.log('CONTEXT', connectionId);

            if (!connections[connectionId]) {
              connections[connectionId] = {
                token,
                hits: 0,
                swaps: 0,
                updated: Date.now(),
              };
            }

            try {
              const decoded = await authContext.decode(connections[connectionId].token);
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
