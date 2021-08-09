import { AuthContext } from '../AuthenticationContext/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User {}

export const useProvideMockAuth = (name?: string): AuthContext => {
  const user = name;

  const signin = async (userPolicyId?: string): Promise<void> => {
    if (userPolicyId) sessionStorage.setItem('currentPolicy', userPolicyId || '');
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const signout = (): void => {};

  const token = async (): Promise<string | null> => '123';

  return {
    user,
    signin,
    token,
    signout,
  };
};
