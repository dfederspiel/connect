import { IResolvers } from '@graphql-tools/utils';
import { IPubSub } from '../lib/types';
import AffirmationsResolvers from './AffirmationsResolvers';
import UsersResolvers from './UsersResolvers';

const resolvers = (pubsub: IPubSub): IResolvers[] => [
  new AffirmationsResolvers(pubsub).resolvers,
  new UsersResolvers().resolvers,
];

export default resolvers;
