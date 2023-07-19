import { RedisPubSub } from 'graphql-redis-subscriptions';
import UserDataSource from '../datasources/UsersDataSource';
import { User } from '@prisma/client';

export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  post(item: T): Promise<T>;
}
export interface IDataSources {
  userApi: UserDataSource;
}

export interface ApolloContext {
  pubsub: RedisPubSub;
  user: User;
  dataSources: IDataSources;
}

export type ConnectionRef = Record<
  string,
  {
    token: string;
    hits: number;
    swaps: number;
    updated: number;
  }
>;
