import { IResolvers } from '@graphql-tools/utils';
import { User } from '@prisma/client';
import { gql } from 'apollo-server-express';
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
interface IUserResolvers extends IResolvers {
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
          _parent,
          args: {
            id: string;
          },
          context: { dataSources: { userApi: UserDataSource } },
        ) => {
          return context.dataSources.userApi.getById(args.id);
        },
        users: (
          _parent,
          _args,
          context: { dataSources: { userApi: UserDataSource } },
        ) => {
          return context.dataSources.userApi.getAll();
        },
      } as IUserResolversQuery,
    };
  };
}
