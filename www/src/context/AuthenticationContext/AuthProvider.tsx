import { useContext, createContext, ReactNode } from 'react';
import { useProvideAuth } from './useProvideAuth';
import { AuthContext } from './types';
import { AuthModule, Mode } from './AuthModule';
/**
 * AuthContext to be passed to any component that depends on user context.
 */

const authContext = createContext<AuthContext>(null as unknown as AuthContext);
const authModule = new AuthModule(Mode.Client);

interface AuthProviderProps {
  children?: ReactNode;
  provider?: AuthContext;
}

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children, provider }: AuthProviderProps): JSX.Element => {
  const auth = useProvideAuth(authModule) as AuthContext;
  return <authContext.Provider value={provider || auth}>{children}</authContext.Provider>;
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = (): AuthContext => useContext(authContext);
