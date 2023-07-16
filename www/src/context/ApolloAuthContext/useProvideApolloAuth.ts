import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useAuth } from '../AuthenticationContext';
import { ApolloAuthContext } from './types';
import { createClient } from 'graphql-ws';
import { AuthStatus } from '../AuthenticationContext/useProvideAuth';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

export const useProvideApolloAuth = (): ApolloAuthContext | undefined => {
  const auth = useAuth();
  if (auth.status !== AuthStatus.Authenticated) return;

  const { hostname, port, protocol } = window.location;
  const portString = port !== '' ? `:${port}` : port;

  console.log(
    // eslint-disable-next-line prettier/prettier
    `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${process.env.APOLLO_HOST}`,
  );

  const link = new GraphQLWsLink(
    createClient({
      url: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${
        process.env.APOLLO_HOST
      }`,
      connectionParams: async () => {
        const token = await auth.token();
        return { authorization: token, test: 'some_other_thing' };
      },
    }),
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return {
    client,
  };
};
