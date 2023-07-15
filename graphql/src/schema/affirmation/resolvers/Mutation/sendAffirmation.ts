import type { MutationResolvers } from './../../../types.generated';

export const AFFIRMATION_GIVEN = 'AFFIRMATION_GIVEN';

export const sendAffirmation: NonNullable<MutationResolvers['sendAffirmation']> = async (
  _,
  { userId },
  { user, pubsub },
) => {
  /* Implement Mutation.sendAffirmation resolver logic here */
  console.log('WEBSOCKET SEND', { userId, user });

  const affirmation = {
    from: user.id,
    to: userId,
  };
  pubsub.publish(`${AFFIRMATION_GIVEN}:${userId}`, affirmation);
  return affirmation;
};
