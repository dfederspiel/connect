import { execute } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { gql } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import GraphQLServer from '../server';
import supertest from 'supertest';
import { Context, createMockContext, MockContext } from '../../__mocks__/context';
import { AuthContext } from '@lib/auth/AuthContext';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { rootTypeDefs } from '../typedefs';
import { AffirmationsTypeDefs } from '../resolvers/AffirmationsResolvers';
import { UsersTypeDefs } from '../resolvers/UsersResolvers';
import resolvers from '../resolvers';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const PORT = 9000;

const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, AffirmationsTypeDefs, UsersTypeDefs],
  resolvers: resolvers(pubsub),
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const createSubscriptionObservable = (uri, authToken, query, variables?) => {
  const link = new WebSocketLink({
    uri,
    options: {
      reconnect: true,
      connectionParams: { authToken, test: 'some_other_thing' },
    },
  });
  return execute(link, { query, variables });
};

const createUnauthenticatedSubscriptionObservable = (uri, query, variables?) => {
  const link = new WebSocketLink({
    uri,
    options: {
      reconnect: true,
      connectionParams: { test: 'some_other_thing' },
    },
  });
  return execute(link, { query, variables });
};

const headers = {
  Authorization: 'Token 1234567890',
  'Content-Type': 'application/json',
};

describe('GraphQL API Subscriptions', () => {
  let serverInstance;
  let mockCtx: MockContext;
  beforeAll((done) => {
    mockCtx = createMockContext();
    mockCtx as unknown as Context;
    const app = express();
    const apollo = new GraphQLServer(schema, pubsub, false, mockCtx.prisma);
    const instance = apollo.server();
    instance.start().then(() => {
      instance.applyMiddleware({
        app,
        cors: {
          credentials: false,
          origin: '*',
        },
      });
      const httpServer = createServer(app);
      // instance.installSubscriptionHandlers(httpServer);
      serverInstance = httpServer.listen(PORT, async () => {
        done();
      });
    });
  });
  afterAll(() => {
    serverInstance.close();
  });

  beforeEach(jest.resetAllMocks);

  xit('will be notified when a stream is created', async () => {
    let eventNum = 0;
    const client = createSubscriptionObservable(
      `ws://localhost:${PORT}/graphql`,
      'some token',
      gql`
        subscription {
          affirmationGiven {
            from
            to
          }
        }
      `,
    );
    jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));
    jest.spyOn(AuthContext.prototype, 'getUser').mockReturnValue(
      Promise.resolve({
        id: 1,
        domain: 'codefly.ninja',
        email: 'david@codefly.ninja',
      }),
    );
    const consumer = client.subscribe(
      (eventData) => {
        // whatever you need to do with the received data
        // for us, that's just checking that data is received and incrementing `eventNum`
        expect(eventData?.data?.affirmationGiven).toBeDefined();
        eventNum++;
      },
      (err) => {
        console.log('subscription error', err);
      },
    );

    await sleep(500);

    const baseURL = supertest(`http://localhost:${PORT}/graphql`);
    await baseURL.post('/graphql').set('Authorization', 'some token').send({
      query: 'mutation { sendAffirmation(userId: 1) { to from } }',
    });

    await sleep(1000);

    expect(eventNum).toEqual(1);
    consumer.unsubscribe();
  });

  it('will not set user context if no token provided', async () => {
    let eventNum = 0;
    const unauthenticatedClient = createUnauthenticatedSubscriptionObservable(
      `ws://localhost:${PORT}/graphql`,
      gql`
        subscription {
          affirmationGiven {
            from
            to
          }
        }
      `,
    );
    jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));
    jest.spyOn(AuthContext.prototype, 'getUser').mockReturnValue(
      Promise.resolve({
        id: 1,
        domain: 'codefly.ninja',
        email: 'david@codefly.ninja',
      }),
    );
    const consumer = unauthenticatedClient.subscribe(
      (eventData) => {
        // whatever you need to do with the received data
        // for us, that's just checking that data is received and incrementing `eventNum`
        expect(eventData?.data?.affirmationGiven).toBeDefined();
        eventNum++;
      },
      (err) => {
        console.log('subscription error', err);
      },
    );
    await sleep(500);

    const baseURL = supertest(`http://localhost:${PORT}/graphql`);
    await baseURL.post('/graphql').set('Authorization', 'some token').send({
      query: 'mutation { sendAffirmation(userId: 1) { to from } }',
    });

    await sleep(1000);

    expect(eventNum).toEqual(0);
    consumer.unsubscribe();
  });

  it('handles errors if user lookup fails', async () => {
    jest.spyOn(AuthContext.prototype, 'getUser').mockReturnValue(Promise.resolve(null));
    process.env.NODE_ENV = 'production';
    const baseURL = supertest(`http://localhost:${PORT}/graphql`);
    await baseURL.post('/graphql').send({
      query: 'mutation { sendAffirmation(userId: 1) { to from } }',
    });
  });

  it('handles errors if user lookup fails', async () => {
    process.env.NODE_ENV = 'production';
    jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));
    jest.spyOn(AuthContext.prototype, 'getUser').mockReturnValue(
      Promise.resolve({
        id: 1,
        domain: 'codefly.ninja',
        email: 'david@codefly.ninja',
      }),
    );
    const baseURL = supertest(`http://localhost:${PORT}/graphql`);
    await baseURL.post('/graphql').set(headers).send({
      query: 'mutation { sendAffirmation(userId: 1) { to from } }',
    });
  });
});
