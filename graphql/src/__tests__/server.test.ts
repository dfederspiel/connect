import { createServer } from 'http';
import GraphQLServer from '../server';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import supertest from 'supertest';
import { exec } from 'child_process';
import { gql } from 'apollo-server-express';

import { MockContext, Context, createMockContext } from '../../__mocks__/context';
import { AuthContext } from '@lib/auth/AuthContext';

jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));

const pubsub = new PubSub();
let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('the graphql server', () => {
  it('exists', () => {
    const server = new GraphQLServer(pubsub, {});
    expect(server).toBeDefined();
  });

  it('can create a server instance', (done) => {
    const app = express();
    const apollo = new GraphQLServer(pubsub, false);
    const instance = apollo.server();
    instance.applyMiddleware({ app });
    const httpServer = createServer(app);
    instance.installSubscriptionHandlers(httpServer);
    const server = app.listen(8080, async () => {
      exec('echo "The \\$HOME variable is $HOME"', (error, stdout, stderr) => {
        console.log('Server started...closing...', stdout, stderr, error);
        server.close();
        done();
      });
    });
  });

  it('can create a server instance with supertest', (done) => {
    const app = express();
    mockCtx.prisma.user.findMany.mockResolvedValue([
      {
        id: 1,
        domain: 'codefly.ninja',
        email: 'david@codefly.ninja',
      },
    ]);
    const apollo = new GraphQLServer(pubsub, false, mockCtx.prisma);
    const instance = apollo.server();
    instance.applyMiddleware({ app });
    const httpServer = createServer(app);
    instance.installSubscriptionHandlers(httpServer);
    const server = app.listen(9000, async () => {
      const baseURL = supertest('http://localhost:9000/graphql');
      console.log('Server started...querying...');
      baseURL
        .post('/graphql')
        .set('Authorization', 'bad token')
        .send({ query: '{ users { id } }' })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.users.length).toEqual(1);
          server.close();
          done();
        });
    });
  });

  it('can query stuff', async () => {
    mockCtx.prisma.user.findMany.mockResolvedValue([
      {
        id: 1,
        domain: '',
        email: '',
      },
    ]);
    const apollo = new GraphQLServer(pubsub, false, mockCtx.prisma);
    const instance = apollo.server();
    const result = await instance.executeOperation({
      query: gql`
        {
          users {
            id
            email
          }
        }
      `,
    });
    expect(result).toMatchSnapshot();
  });

  it('requires authentication if in production', async () => {
    process.env.NODE_ENV = 'production';
    const apollo = new GraphQLServer(pubsub, false, mockCtx.prisma);
    const instance = apollo.server();
    instance
      .executeOperation({
        query: gql`
          {
            users {
              id
              email
            }
          }
        `,
      })
      .catch((err) => {
        expect(err).toMatchSnapshot();
      });
  });
});
