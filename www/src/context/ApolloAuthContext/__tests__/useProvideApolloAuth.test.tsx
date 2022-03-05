import { gql } from '@apollo/client';
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

  // it('can query stuff', async () => {
  //   const mockFetchPromise = Promise.resolve({
  //     ok: true,
  //     status: 200,
  //     async text() {
  //       return JSON.stringify({
  //         data: {
  //           users: [],
  //         },
  //       });
  //     },
  //     async json() {
  //       return { ok: 'yay' };
  //     },
  //   });
  //   global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
  //   const { result } = renderHook(() => useProvideApolloAuth(), { wrapper });
  //   const response = await result.current?.client.query({
  //     query: gql`
  //       {
  //         users {
  //           id
  //           email
  //         }
  //       }
  //     `,
  //   });
  //   expect(response).toMatchSnapshot();
  // });

  // it('can append tokens to websocket connections', (done) => {
  //   const { result } = renderHook(() => useProvideApolloAuth(), { wrapper });

  //   const wsresponse = result.current.client
  //     .subscribe({
  //       query: AFFIRMATION_GIVEN_SUBSCRIPTION,
  //       variables: { userId: 1 },
  //     })
  //     .subscribe({
  //       next({ data }) {
  //         expect(data.somethingChanged).toEqual('finally');
  //         done();
  //       },
  //     });

  //   const response = result.current.client.link.request({
  //     operationName: 'subscription',
  //     query: AFFIRMATION_GIVEN_SUBSCRIPTION,
  //     variables: { userId: 1 },
  //     extensions: {},
  //     getContext: (): Record<string, any> => {
  //       return {};
  //     },
  //     setContext: (): Record<string, any> => {
  //       return {};
  //     },
  //   });

  //   setTimeout(() => {
  //     pubsub.publish('AFFIRMATION_GIVEN', {
  //       from: 1,
  //       to: 2,
  //     });
  //   }, 100);
  //   // expect(response).toMatchSnapshot();
  //   expect(wsresponse).toMatchSnapshot();
  // });
});
