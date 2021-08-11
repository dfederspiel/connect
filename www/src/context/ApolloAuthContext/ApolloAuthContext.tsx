import { useProvideApolloAuth } from './useProvideApolloAuth';
import { ApolloProvider } from '@apollo/client';

// Provider component that wraps the Apollo client.
// This is necessary because we will need auth context
// to attach tokens to the header. See useProvideApolloAuth
// to see how we encapsulate the client instance with useAuth
// and attach it in the setContext Apollo route (for modifying outgoing requests)

export const ApolloAuthProvider = ({
  children,
}: JSX.ElementChildrenAttribute): JSX.Element => {
  const apolloAuth = useProvideApolloAuth();
  return <ApolloProvider client={apolloAuth.client}>{children}</ApolloProvider>;
};

// We will never "useProvideApolloAuth" in a component, so we don't need to export it
// This provider is only here to encapsulate the <ApolloProvider> and client for auth.
