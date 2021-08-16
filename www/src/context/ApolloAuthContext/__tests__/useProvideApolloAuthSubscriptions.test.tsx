import { MockAuthProvider } from '../../MockAuthenticationContext/MockAuthProvider';
import { renderHook } from '@testing-library/react-hooks';
import { useProvideApolloAuth } from '../useProvideApolloAuth';
import 'cross-fetch/polyfill';
import { ApolloAuthProvider } from '../ApolloAuthContext';
import { AFFIRMATION_GIVEN_SUBSCRIPTION } from '../../../graphql/subscriptions';

beforeAll(() => {
  process.env.APOLLO_HOST = 'http://localhost:9000/graphql';
  process.env.APOLLO_WS_HOST = 'ws://localhost:9000/graphql';
});

describe('the apollo auth context', () => {
  const wrapper = ({ children }: any) => (
    <MockAuthProvider user="user@contoso.com">
      <ApolloAuthProvider>{children}</ApolloAuthProvider>
    </MockAuthProvider>
  );

  it('renders with a client', () => {
    const { result } = renderHook(() => useProvideApolloAuth());
    expect(result.current.client).toBeDefined();
  });

  it('can append tokens to websocket connections', (done) => {
    const { result } = renderHook(() => useProvideApolloAuth(), { wrapper });

    const wsresponse = result.current.client.subscribe({
      query: AFFIRMATION_GIVEN_SUBSCRIPTION,
      variables: { userId: 1 },
    });

    const response = result.current.client.link.request({
      operationName: 'subscription',
      query: AFFIRMATION_GIVEN_SUBSCRIPTION,
      variables: { userId: 1 },
      extensions: {},
      getContext: (): Record<string, any> => {
        return {};
      },
      setContext: (): Record<string, any> => {
        return {};
      },
    });

    response?.subscribe({
      next({ data }) {
        expect(data?.somethingChanged).toEqual('finally');
        done();
      },
    });
    // expect(response).toMatchSnapshot();
    expect(wsresponse).toMatchSnapshot();
  });
});
