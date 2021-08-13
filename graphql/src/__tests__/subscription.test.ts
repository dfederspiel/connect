import { execute } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { gql, PubSub } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { exec } from 'child_process';
import GraphQLServer from '../server';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
import supertest from 'supertest';
import { Context, createMockContext, MockContext } from '../../__mocks__/context';
import { AuthContext } from '@lib/auth/AuthContext';

const pubsub = new PubSub();
jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));
jest.spyOn(AuthContext.prototype, 'getUser').mockReturnValue(
  Promise.resolve({
    id: 1,
    domain: 'codefly.ninja',
    email: 'david@codefly.ninja',
  }),
);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const getWsClient = (wsurl, authToken) => {
  const client = new SubscriptionClient(
    wsurl,
    {
      reconnect: true,
      connectionParams: authToken,
    },
    ws,
  );
  return client;
};

const createSubscriptionObservable = (wsurl, authToken, query, variables?) => {
  const link = new WebSocketLink(getWsClient(wsurl, authToken));
  return execute(link, { query: query, variables: variables });
};

describe('GraphQL API Subscriptions', () => {
  let serverInstance;
  let mockCtx: MockContext;
  beforeAll((done) => {
    mockCtx = createMockContext();
    mockCtx as unknown as Context;
    const app = express();
    const apollo = new GraphQLServer(pubsub, false, mockCtx.prisma);
    const instance = apollo.server();
    instance.applyMiddleware({
      app,
      cors: {
        credentials: false,
        origin: '*',
      },
    });
    const httpServer = createServer(app);
    instance.installSubscriptionHandlers(httpServer);
    serverInstance = httpServer.listen(9020, async () => {
      exec('echo "The \\$HOME variable is $HOME"', (error, stdout, stderr) => {
        console.log('Server started...ready for tests', stdout, stderr, error);
        sleep(1000).then(done);
      });
    });
  });
  afterAll(() => {
    serverInstance.close();
  });

  it('Should be notified when a stream is created', async () => {
    let eventNum = 0; // initialise a count of the events received by the subscription
    const query = gql`
      subscription {
        affirmationGiven {
          from
          to
        }
      }
    `; // the subscription query
    const client = createSubscriptionObservable(
      'ws://localhost:9020/graphql',
      'some token',
      query,
    );
    const consumer = client.subscribe(
      (eventData) => {
        // whatever you need to do with the received data
        // for us, that's just checking that data is received and incrementing `eventNum`
        expect(eventData?.data?.affirmationGiven).toBeDefined();
        eventNum++;
      },
      (err) => {
        console.log(err);
      },
    );
    await sleep(500);

    const baseURL = supertest('http://localhost:9020/graphql');
    await baseURL.post('/graphql').set('Authorization', 'some token').send({
      query: 'mutation { sendAffirmation(userId: 1) { to from } }',
    });

    await sleep(1000);

    expect(eventNum).toEqual(1);
    consumer.unsubscribe();
  });
});
