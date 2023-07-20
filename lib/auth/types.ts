import { Prisma, User } from '@prisma/client';

export interface IDataContext<T> {
  getAll: () => Promise<T[]>;
  get(id: string): Promise<T | null>;
  post(item: T): Promise<T>;
}

export interface IUserDataContext extends IDataContext<User> {
  getByEmail(email: string): Promise<User | null>;
  createUser(email?: string): Promise<User | null>;
}

const userWithSessions = Prisma.validator<Prisma.UserArgs>()({
  include: { sessions: true },
});

export type UserWithSessions = Prisma.UserGetPayload<typeof userWithSessions>;
