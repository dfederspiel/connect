import { IUserDataContext } from '@lib/auth/types';
import { User } from '@prisma/client';
import { DataSource } from 'apollo-datasource';

export default class UserDataSource extends DataSource {
  private context: IUserDataContext;
  constructor(context: IUserDataContext) {
    super();
    this.context = context;
  }

  getAll = async (): Promise<User[]> => this.context.getAll();
  getById = async (id: string): Promise<User | null> => this.context.get(id);
}
