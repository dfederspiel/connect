import { useState } from 'react';
import { AuthContext } from './types';
import { AuthModule } from './AuthModule';

export enum AuthStatus {
  Unauthenticated,
  Authenticated,
}

export const useProvideAuth = (auth: AuthModule): AuthContext => {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.Unauthenticated);
  const [user, setUser] = useState<string | undefined>(auth?.account?.name);

  auth.onAccount((user?: string) => {
    if (user) {
      setUser(user);
      setStatus(AuthStatus.Authenticated);
    }
  });

  const signin = async (): Promise<void> => {
    auth.login();
  };
  const signout = (): void => {
    auth.logout();
  };

  const token = async (): Promise<string | null> => {
    try {
      const response = await auth.token();
      return response;
    } catch (ex) {
      return null;
    }
  };

  return {
    status,
    user,
    signin,
    token,
    signout,
  };
};
