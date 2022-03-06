import { User } from '@prisma/client';
import { MockUserDataContext } from '../../../__mocks__/MockUserDataContext';
import UsersResolvers from '../UsersResolvers';

const user = {
  id: 1,
  domain: '',
  email: 'david@codefly.ninja',
};

const context = {
  dataSources: {
    users: {
      getById: async (): Promise<User | null> => user,
      getAll: async (): Promise<User[]> => [user, user],
      context: MockUserDataContext,
    } as any,
  },
  user: {
    id: 1,
    domain: '',
    email: '',
  } as User,
};

describe('the user resolvers', () => {
  it('exists', () => {
    const resolver = new UsersResolvers();
    expect(resolver).toBeDefined();
  });

  describe('when the user context is set', () => {
    it('can get the current user', async () => {
      const resolver = new UsersResolvers();
      const user = await resolver.resolvers.Query.user(null, null, context, null);
      expect(user).toMatchSnapshot();
    });

    it('can resolve all users', async () => {
      const resolver = new UsersResolvers();
      const users = await resolver.resolvers.Query.users(null, null, context, null);
      expect(users).toMatchSnapshot();
    });
  });
});
