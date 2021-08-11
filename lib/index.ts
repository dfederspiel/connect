export { AuthContext } from './AuthContext';
export { IUserDataContext } from './UserDataContext';
export { IDataContext, IPubSub } from './types';

export const test = (source: string): string => {
  return `ALIASING WORKING FOR ${source}`;
};
