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
  login(): void;
  logout(): void;
  token(forceRefresh: boolean): Promise<string | null>;
};

export type { AuthContext, Policy, UserProfile };
