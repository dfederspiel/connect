import type { SubscriptionResolvers } from './../../../types.generated';
import { AFFIRMATION_GIVEN } from '../Mutation/sendAffirmation';

export const affirmationGiven: NonNullable<SubscriptionResolvers['affirmationGiven']> = {
  // subscribe: (payload, _args, context) => {
  //   const { user } = context;
  //   console.log('WEBSOCKET SUBSCRIBE', { payload, _args, user });
  //   return context.pubsub.asyncIterator([`${AFFIRMATION_GIVEN}:${user.id}`]) as any;
  // },
  // subscribe: (payload, _args, { user, pubsub }) => {
  //   return {
  //     [Symbol.asyncIterator]() {
  //       return {
  //         async next() {
  //           console.log('In the iterator', user, _args, payload);
  //           return pubsub.asyncIterator([AFFIRMATION_GIVEN]).next();
  //         },
  //       };
  //     },
  //   };
  // },
  resolve: (payload) => {
    return { ...payload, ...{ to: 'analyze and change the payload if desired' } };
  },
  subscribe: (payload, _args, { user, pubsub }) => {
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
  // subscribe: withFilter(
  //   () => this.pubsub.asyncIterator(AFFIRMATION_GIVEN),
  //   (payload, _args, context) => {
  //     console.log('WEBSOCKET SUBSCRIBE', payload, _args, context);
  //     return payload.to === context.user.id;
  //   },
  // ),
};
