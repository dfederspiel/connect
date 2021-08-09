import { User } from '@prisma/client';
import { IUserDataContext } from '../data/UserDataContext';
import { DataSource } from 'apollo-datasource';

export default class UserDataSource extends DataSource {
  private context: IUserDataContext;
  constructor(context: IUserDataContext) {
    super();
    this.context = context;
  }

  getAll = async (): Promise<User[]> => {
    const users = await this.context.getAll();
    console.log('[USERS]', users);
    return users;
  };

  getById = async (id: string): Promise<User | null> => {
    return await this.context.get(id);
  };
}
