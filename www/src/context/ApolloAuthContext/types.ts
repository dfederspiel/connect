import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export type ApolloAuthContext = {
  client: ApolloClient<NormalizedCacheObject>;
};
