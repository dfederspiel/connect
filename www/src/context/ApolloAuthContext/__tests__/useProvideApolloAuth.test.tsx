import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MockAuthProvider } from '../../MockAuthenticationContext/MockAuthProvider';
import { renderHook } from '@testing-library/react-hooks';
import { useProvideApolloAuth } from '../useProvideApolloAuth';

beforeAll(() => {
  process.env.APOLLO_HOST = 'http://localhost/graphql';
  process.env.APOLLO_WS_HOST = 'ws://localhost/ws';
});

describe('the apollo auth context', () => {
  const wrapper = ({ children }: any) => (
    <MockAuthProvider user="user@contoso.com">
      <MockedProvider>{children}</MockedProvider>
    </MockAuthProvider>
  );

  it('renders with a client', () => {
    const { result } = renderHook(() => useProvideApolloAuth());
    expect(result.current.client).toBeDefined();
  });

  it('can query stuff', async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({
          data: {
            users: [],
          },
        });
      },
      async json() {
        return { ok: 'yay' };
      },
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    const { result } = renderHook(() => useProvideApolloAuth(), { wrapper });
    const response = await result.current.client.query({
      query: gql`
        {
          users {
            id
            email
          }
        }
      `,
    });
    expect(response).toBeDefined();
  });
});
