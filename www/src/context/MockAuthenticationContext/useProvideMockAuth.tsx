/* eslint-disable @typescript-eslint/no-empty-function */
import { AuthContext } from '../AuthenticationContext/types';
import { AuthStatus } from '../AuthenticationContext/useProvideAuth';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User {}

export const useProvideMockAuth = (name?: string): AuthContext => {
  const user = name || 'test_user';

  const status = AuthStatus.Authenticated;

  const login = async (): Promise<void> => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const logout = (): void => {};

  const token = async (): Promise<string | null> => '123';

  return {
    status,
    user,
    login,
    logout,
    token,
  };
};
