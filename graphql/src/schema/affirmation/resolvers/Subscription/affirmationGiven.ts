import type { SubscriptionResolvers } from './../../../types.generated';
import { AFFIRMATION_GIVEN } from '../Mutation/sendAffirmation';

export const affirmationGiven: NonNullable<SubscriptionResolvers['affirmationGiven']> = {
  resolve: (payload) => {
    return { ...payload, ...{ to: 'analyze and change the payload if desired' } };
  },
  subscribe: (_, _args, { user, pubsub }) => {
    return {
      [Symbol.asyncIterator]() {
        return {
          async next(args) {
            return pubsub
              .asyncIterator([`${AFFIRMATION_GIVEN}:${user.id}`])
              .next(args)
              .catch((e) => {
                console.log('ERROR!', e);
                return e;
              });
          },
          async throw(e) {
            throw new Error(e);
          },
        };
      },
    };
  },
};
