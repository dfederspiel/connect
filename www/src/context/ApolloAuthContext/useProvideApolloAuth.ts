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

export const useProvideApolloAuth = (): ApolloAuthContext => {
  const { hostname, port, protocol } = window.location;
  const portString = port !== '' ? `:${port}` : port;
  const auth = useAuth();
  // const httpLink = createHttpLink({
  //   uri: `${process.env.APOLLO_HOST}`,
  // });
  const httpLink: ApolloLink = new HttpLink({
    uri: `${protocol}//${hostname}${portString}${process.env.APOLLO_HOST}`,
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

  // const wsLink = new WebSocketLink({
  //   uri: `${process.env.APOLLO_WS_HOST}`,
  //   options: {
  //     reconnect: true,
  //     connectionParams: async (): Promise<ConnectionParams> => {
  //       const token = await auth.token();
  //       console.log('GRAPHQL WS', token);
  //       return { authToken: token, test: 'some_other_thing' };
  //     },
  //   },
  // });

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
  const wsLink = new WebSocketLink({
    // eslint-disable-next-line prettier/prettier
    url: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${process.env.APOLLO_HOST}`,
    connectionParams: async () => {
      const token = await auth.token();
      return { authToken: token, test: 'some_other_thing' };
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
