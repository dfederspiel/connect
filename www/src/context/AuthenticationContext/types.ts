import { AuthStatus } from './useProvideAuth';

type Policy = {
  policyId: number;
  url: string;
};

type UserProfile = {
  name: string;
  email: string;
};

type AuthContext = {
  status: AuthStatus;
  user: string | undefined;
  signin(): void;
  signout(): void;
  token(): Promise<string | null>;
};

export type { AuthContext, Policy, UserProfile };
