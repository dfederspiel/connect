import { User } from '@prisma/client';
import { gql, IResolvers, withFilter } from 'apollo-server-express';
import { IPubSub } from '../lib/types';

const AFFIRMATION_GIVEN = 'AFFIRMATION_GIVEN';

export const AffirmationsTypeDefs = gql`
  type Affirmation {
    from: ID!
    to: ID!
  }

  extend type Mutation {
    sendAffirmation(userId: ID!): Affirmation
  }

  extend type Subscription {
    affirmationGiven: Affirmation
  }
`;

export default class AffirmationsResolvers {
  resolvers: IResolvers;
  pubsub: IPubSub;

  constructor(pubsub: IPubSub) {
    this.resolvers = this.initializeResolvers();
    this.pubsub = pubsub;
  }

  initializeResolvers = (): IResolvers => {
    return {
      Mutation: {
        sendAffirmation: async (_: any, { userId }: any, context: { user: User }) => {
          const affirmation = {
            from: context.user.id,
            to: userId,
          };
          this.pubsub.publish(AFFIRMATION_GIVEN, affirmation);
          return affirmation;
        },
      },
      Subscription: {
        affirmationGiven: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator('AFFIRMATION_GIVEN'),
            (payload, _, context) => {
              return parseInt(payload.to) === context.user.id;
            },
          ),
        },
      },
    };
  };
}
