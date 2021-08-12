import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import GraphQLServer from './src/server';
import { DataMocks } from './__mocks__/mocks';

import { test } from '@lib/tools';
console.log(test('GRAPHQL'));

import { PubSub } from 'graphql-subscriptions';
import faker from 'faker';

const pubsub = new PubSub();

const mocks = process.env.USE_MOCKS === 'sure' ? DataMocks : false;
const graphQlServer = new GraphQLServer(pubsub, mocks);
const apollo = graphQlServer.server();

const port = process.env.PORT || faker.datatype.number({ min: 4500, max: 5500 });

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
