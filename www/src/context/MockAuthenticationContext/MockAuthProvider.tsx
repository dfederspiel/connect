import { useProvideMockAuth } from '.';
import { AuthProvider } from '../AuthenticationContext/';
import { AuthContext } from '../AuthenticationContext/types';
// import { AuthModule, Mode } from "./AuthModule";
/**
 * AuthContext to be passed to any component that depends on user context.
 */
// const authContext = createContext<AuthContext>(null as any);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
// eslint-disable-next-line react/prop-types

interface MockAuthProviderProps {
  origin?: string;
  children?: JSX.Element;
  user?: string;
}

export const MockAuthProvider = (props: MockAuthProviderProps): JSX.Element => {
  const { origin, children, user } = props;
  const auth = useProvideMockAuth(user) as AuthContext;
  return (
    <AuthProvider origin={origin} provider={auth}>
      {children}
    </AuthProvider>
  );
};
