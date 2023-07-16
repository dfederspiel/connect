import { MockedProvider } from '@apollo/client/testing';
import { MockAuthProvider } from '../../MockAuthenticationContext/MockAuthProvider';
import { renderHook } from '@testing-library/react-hooks';
import { useProvideApolloAuth } from '../useProvideApolloAuth';
import 'cross-fetch/polyfill';

beforeAll(() => {
  process.env.APOLLO_HOST = 'http://localhost:9000/graphql';
  process.env.APOLLO_WS_HOST = 'ws://localhost:9000/graphql';
});

describe('the apollo auth context', () => {
  const wrapper = ({ children }: any) => (
    <MockAuthProvider user="user@contoso.com">
      <MockedProvider>{children}</MockedProvider>
    </MockAuthProvider>
  );

  it('renders with a client', () => {
    const { result } = renderHook(() => useProvideApolloAuth(), { wrapper });
    expect(result.current?.client).toBeDefined();
  });
});
