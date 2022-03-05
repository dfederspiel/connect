/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@prisma/client';
import AffirmationsResolvers from '../AffirmationsResolvers';
import { PubSub } from 'graphql-subscriptions';
import supertest from 'supertest';
import express from 'express';
import GraphQLServer from '../../server';
import { createServer } from 'http';



const pubsub = new PubSub();
import { MockContext, Context, createMockContext } from '../../../__mocks__/context';


let mockCtx: MockContext;
let ctx: Context;

const context = {
  user: {
    id: 1,
    domain: '',
    email: '',
  } as User,
};

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

describe('the affirmations resolver', () => {
  it('exists', () => {
    const resolver = new AffirmationsResolvers(pubsub);
    expect(resolver).toBeDefined();
  });

  it('can send affirmations', async () => {
    const resolver = new AffirmationsResolvers(pubsub);
    const result = await resolver.resolvers.Mutation.sendAffirmation(
      null,
      { userId: '1' },
      context,
      null,
    );
    expect(result).toMatchSnapshot();
  });

  it('can cover subscriptions', async () => {
    const resolver = new AffirmationsResolvers(pubsub);
    const fn = await resolver.resolvers.Subscription.affirmationGiven.subscribe();
    await pubsub.publish('AFFIRMATION_GIVEN', {});
    await resolver.resolvers.Mutation.sendAffirmation(
      null,
      { userId: '1' },
      context,
      null,
    )
  });
});
