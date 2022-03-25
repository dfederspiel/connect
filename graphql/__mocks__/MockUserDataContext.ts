import { IUserDataContext } from '@lib/auth/UserDataContext';
import { User } from '@prisma/client';

const user = {
  id: 1,
  domain: 'codefly.ninja',
  email: 'david@codefly.ninja',
} as User;

export const MockUserDataContext = {
  createUser: async () => user,
  getById: async () => user,
  getAll: async () => [user],
  getByEmail: async () => user,
  post: async (user: User) => user,
} as IUserDataContext;
