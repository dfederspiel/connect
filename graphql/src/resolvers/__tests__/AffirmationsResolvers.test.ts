/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@prisma/client';
import { IPubSub } from '../../lib/types';
import AffirmationsResolvers from '../AffirmationsResolvers';


const mockPubSub = {
  publish: (tag, payload) => { },
  asyncIterator: (tag) => { },
} as IPubSub;
const context = {
  user: {
    id: 1,
    domain: '',
    email: '',
  } as User,
};

describe('the affirmations resolver', () => {
  it('exists', () => {
    const resolver = new AffirmationsResolvers(mockPubSub);
    expect(resolver).toBeDefined();
  });

  it('can send affirmations', async () => {
    const resolver = new AffirmationsResolvers(mockPubSub);
    const result = await resolver.resolvers.Mutation.sendAffirmation(
      null,
      { userId: '1' },
      context,
      null,
    );
    expect(result).toMatchSnapshot();
  });

  xit('can cover subscriptions', async () => {
    const resolver = new AffirmationsResolvers(mockPubSub as unknown as IPubSub);
    const result = await resolver.resolvers.Subscription.affirmationGiven.subscribe();
    await result.return({
      to: '1',
    }, null, {
      user: {
        id: '1'
      }
    });
    expect(result).toBeDefined();
  });
});
