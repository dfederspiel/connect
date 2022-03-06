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
    return this.context.getAll();
  };

  getById = async (id?: number): Promise<User | null> => {
    return id ? this.context.getById(id) : null;
  };
}
