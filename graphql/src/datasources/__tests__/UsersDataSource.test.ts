import { MockUserDataContext } from '../../../__mocks__/MockUserDataContext';
import UserDataSource from '../UsersDataSource';

describe('the users datasource', () => {
  it('exists', () => {
    const datasource = new UserDataSource(MockUserDataContext);
    expect(datasource).toBeDefined();
  });

  it('can query all users', async () => {
    const datasource = new UserDataSource(MockUserDataContext);
    const users = await datasource.getAll();
    expect(users.length).toBeGreaterThan(0);
  });

  it('can get a user by id', async () => {
    const datasource = new UserDataSource(MockUserDataContext);
    const user = await datasource.getById('1');
    expect(user).toBeDefined();
    expect(user).toMatchSnapshot();
  });
});
