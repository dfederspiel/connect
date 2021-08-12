import { createServer } from 'http';
import GraphQLServer from '../server';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import { exec } from 'child_process';
import { gql } from 'apollo-server-express';

import { MockContext, Context, createMockContext } from '../../__mocks__/context';

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
});
