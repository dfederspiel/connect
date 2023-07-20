import { IUserDataContext } from '@lib/auth/types';
import { PrismaClient, User } from '@prisma/client';

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
        email: email,
      },
    });
  }

  async getAll(): Promise<User[]> {
    return this.client.user.findMany();
  }

  async get(id: string): Promise<User | null> {
    return this.client.user.findUnique({
      where: {
        id,
      },
    });
  }

  async post(item: User): Promise<User> {
    return this.client.user.create({
      data: item,
    });
  }
}
