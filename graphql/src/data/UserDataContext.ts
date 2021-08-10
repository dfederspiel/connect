import { IDataContext } from '../lib/types';
import { PrismaClient, User } from '@prisma/client';

export interface IUserDataContext extends IDataContext<User> {
  getByEmail(email: string): Promise<User | null>;
  createUser(email?: string): Promise<User>;
}

export default class UserDataContext implements IUserDataContext {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async createUser(email: string): Promise<User> {
    return await this.client.user.create({
      data: {
        email: email,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.client.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getAll(): Promise<User[]> {
    return await this.client.user.findMany();
  }
  async get(id: string): Promise<User | null> {
    return await this.client.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }
  async post(item: User): Promise<User> {
    return await this.client.user.create({
      data: item,
    });
  }
  async delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async put(item: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
