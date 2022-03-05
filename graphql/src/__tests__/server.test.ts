import GraphQLServer from '../server';
import { PubSub } from 'graphql-subscriptions';
import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { MockContext, Context, createMockContext } from '../../__mocks__/context';
import { AuthContext } from '@lib/auth/AuthContext';
import { rootTypeDefs } from '../typedefs';
import { AffirmationsTypeDefs } from '../resolvers/AffirmationsResolvers';
import { UsersTypeDefs } from '../resolvers/UsersResolvers';
import resolvers from '../resolvers';

jest.spyOn(AuthContext.prototype, 'decode').mockReturnValue(Promise.resolve({}));

const pubsub = new PubSub();
let mockCtx: MockContext;
let ctx: Context;

const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, AffirmationsTypeDefs, UsersTypeDefs],
  resolvers: resolvers(pubsub),
});

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('the graphql server', () => {
  it('exists', () => {
    const server = new GraphQLServer(schema, pubsub, {});
    expect(server).toBeDefined();
  });

  it('can query stuff', async () => {
    mockCtx.prisma.user.findMany.mockResolvedValue([
      {
        id: 1,
        domain: '',
        email: '',
      },
    ]);
    const apollo = new GraphQLServer(schema, pubsub, false, mockCtx.prisma);
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
    const apollo = new GraphQLServer(schema, pubsub, false, mockCtx.prisma);
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
