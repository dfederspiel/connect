import { IDataContext } from './types';
import { PrismaClient, User } from '@prisma/client';

export interface IUserDataContext extends IDataContext<User> {
  getByEmail(email: string): Promise<User | null>;
  createUser(email?: string): Promise<User>;
}

export default class UserDataContext implements IUserDataContext {
  client: PrismaClient;

  constructor(context: PrismaClient) {
    this.client = context;
  }

  async createUser(email: string): Promise<User> {
    return this.client.user.create({
      data: {
        email: email,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getAll(): Promise<User[]> {
    return this.client.user.findMany();
  }

  async get(id: string): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        id: String(id),
      },
    });
  }
  async post(item: User): Promise<User> {
    return this.client.user.create({
      data: item,
    });
  }
}
