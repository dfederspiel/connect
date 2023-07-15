/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { Affirmation } from './affirmation/resolvers/Affirmation';
import    { sendAffirmation as Mutation_sendAffirmation } from './affirmation/resolvers/Mutation/sendAffirmation';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { affirmationGiven as Subscription_affirmationGiven } from './affirmation/resolvers/Subscription/affirmationGiven';
import    { User } from './user/resolvers/User';
    export const resolvers: Resolvers = {
      Query: { user: Query_user,users: Query_users },
      Mutation: { sendAffirmation: Mutation_sendAffirmation },
      Subscription: { affirmationGiven: Subscription_affirmationGiven },
      Affirmation: Affirmation,
User: User
    }