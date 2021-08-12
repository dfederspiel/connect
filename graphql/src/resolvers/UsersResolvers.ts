import { User } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import UserDataSource from '../datasources/UsersDataSource';

export const UsersTypeDefs = gql`
  type User {
    id: ID!
    email: String
    domain: String
  }

  extend type Query {
    user: User
    users: [User]
  }
`;

interface IUserResolversQuery {
  user(parent: any, args: any, context: any, other: any): Promise<User | null>;
  users(parent: any, args: any, context: any, other: any): Promise<User[]>;
}
interface IUserResolvers {
  Query: IUserResolversQuery;
}

export default class UsersResolvers {
  resolvers: IUserResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  private initializeResolvers = (): IUserResolvers => {
    return {
      Query: {
        user: (
          _: any,
          _args: any,
          context: { user: User; dataSources: { userApi: UserDataSource } },
          __: any,
        ) => {
          // if (!context.user)
          //   return {
          //     error: 'There is no user context, did you forget to pass a bearer token?',
          //   };
          return context.dataSources.userApi.getById(context.user.id.toString());
        },
        users: (
          _: any,
          _args: any,
          context: { user: User; dataSources: { userApi: UserDataSource } },
          __: any,
        ) => {
          // if (!context.user)
          //   return {
          //     error: 'There is no user context, did you forget to pass a bearer token?',
          //   };
          return context.dataSources.userApi.getAll();
        },
      } as IUserResolversQuery,
    };
  };
}
