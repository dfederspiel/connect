import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { OperationDefinitionNode } from 'graphql';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { useAuth } from '../AuthenticationContext';
import { ApolloAuthContext } from './types';

export const useProvideApolloAuth = (): ApolloAuthContext => {
  const auth = useAuth();
  const httpLink = createHttpLink({
    uri: `${process.env.APOLLO_HOST}`,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await auth.token();
    console.log('GRAPHQL HTTP', token);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const wsLink = new WebSocketLink({
    uri: `${process.env.APOLLO_WS_HOST}`,
    options: {
      reconnect: true,
      connectionParams: async (): Promise<ConnectionParams> => {
        const token = await auth.token();
        console.log('GRAPHQL WS', token);
        return { authToken: token, test: 'some_other_thing' };
      },
    },
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return {
    client,
  };
};
