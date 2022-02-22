import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  HttpLink,
  InMemoryCache,
  Operation,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import { OperationDefinitionNode, print } from 'graphql';
import { useAuth } from '../AuthenticationContext';
import { ApolloAuthContext } from './types';
import { createClient, ClientOptions, Client } from 'graphql-ws';
import { AuthStatus } from '../AuthenticationContext/useProvideAuth';

export const useProvideApolloAuth = (): ApolloAuthContext | undefined => {
  const auth = useAuth();

  if (auth.status !== AuthStatus.Authenticated) return;

  const { hostname, port, protocol } = window.location;
  const portString = port !== '' ? `:${port}` : port;

  class WebSocketLink extends ApolloLink {
    private client: Client;

    constructor(options: ClientOptions) {
      super();
      this.client = createClient(options);
    }

    public request(operation: Operation): Observable<FetchResult> {
      return new Observable((sink) => {
        return this.client.subscribe<FetchResult>(
          { ...operation, query: print(operation.query) },
          {
            next: sink.next.bind(sink),
            complete: sink.complete.bind(sink),
            error: sink.error.bind(sink),
          },
        );
      });
    }
  }
  console.log(
    // eslint-disable-next-line prettier/prettier
    `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${process.env.APOLLO_HOST}`,
  );
  const link = new WebSocketLink({
    // eslint-disable-next-line prettier/prettier
    url: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${process.env.APOLLO_HOST}`,
    connectionParams: async () => {
      const token = await auth.token();
      return { authorization: token, test: 'some_other_thing' };
    },
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return {
    client,
  };
};
