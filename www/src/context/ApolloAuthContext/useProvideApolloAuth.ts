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

  let socket: WebSocket | null = null;
  const link = new GraphQLWsLink(
    createClient({
      url: `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}${portString}${
        process.env.APOLLO_HOST
      }`,
      connectionParams: async () => {
        const token = await auth.token(false);
        return { authorization: token, test: 'some_other_thing' };
      },
      on: {
        closed: (event) => {
          console.log('CLOSED', event);
        },
        connected: async (currentSocket) => {
          socket = currentSocket as WebSocket;
          const intervalId = setInterval(async () => {
            const token = await auth.token(true);
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: 'ping',
                  payload: {
                    token: token,
                  },
                }),
              );
            } else {
              clearInterval(intervalId);
            }
          }, 5 * 60 * 1000);

          console.log('CONNECTED', socket);
        },
      },
    }),
  );
  console.log('HOW MANY TIMES');
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  return {
    client,
  };
};
