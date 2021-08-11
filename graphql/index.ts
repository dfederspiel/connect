import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import GraphQLServer from './src/server';

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { DataMocks } from './src/mocks';

import { test } from '@lib/index';
console.log(test('GRAPHQL'));
const pubsub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || '',
    port: 6379,
    retry_strategy: (options: { attempt: number }) => {
      return Math.max(options.attempt * 100, 3000);
    },
  },
});

const mocks = process.env.USE_MOCKS === 'sure' ? DataMocks : false;
const graphQlServer = new GraphQLServer(pubsub, mocks);
const apollo = graphQlServer.server();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());

const httpServer = createServer(app);

apollo.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: '*',
  },
});
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(
    `GraphQL Playground ready at http://localhost:${port}${apollo.graphqlPath}`,
  );
  console.log(`Subscriptions ready at ws://localhost:${port}${apollo.subscriptionsPath}`);
});
