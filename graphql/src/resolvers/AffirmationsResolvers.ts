import { User } from '@prisma/client';
import { gql } from 'apollo-server-express';
import { withFilter } from 'graphql-subscriptions';
import { IResolvers } from '@graphql-tools/utils';
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

interface IAffirmationsMutationResolvers {
  sendAffirmation(
    parent: any,
    args: any,
    context: any,
    other: any,
  ): Promise<{
    from: number;
    to: any;
  }>;
}

interface IAffirmationsSubscriptionResolvers {
  affirmationGiven: {
    subscribe(): any;
  };
}
interface IAffirmationsResolvers extends IResolvers {
  Mutation: IAffirmationsMutationResolvers;
  Subscription: IAffirmationsSubscriptionResolvers;
}

export default class AffirmationsResolvers {
  resolvers: IAffirmationsResolvers;
  pubsub: IPubSub;

  constructor(pubsub: IPubSub) {
    this.resolvers = this.initializeResolvers();
    this.pubsub = pubsub;
  }

  initializeResolvers = (): IAffirmationsResolvers => {
    return {
      Mutation: {
        sendAffirmation: async (_: any, { userId }: any, context: { user: User }) => {
          console.log('WEBSOCKET SEND', _, userId, context.user);

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
            (payload, _args, context) => {
              console.log('WEBSOCKET SUBSCRIBE', payload, _args, context);
              return parseInt(payload.to) === context.user.id;
            },
          ),
        },
      },
    };
  };
}
