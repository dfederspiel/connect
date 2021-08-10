import { render } from '@testing-library/react';
import { ApolloAuthProvider } from '../ApolloAuthContext';

beforeAll(() => {
  process.env.APOLLO_HOST = 'http://localhost/graphql';
  process.env.APOLLO_WS_HOST = 'ws://localhost/ws';
});

describe('the auth provider', () => {
  it('exists', () => {
    const { asFragment } = render(<ApolloAuthProvider>test</ApolloAuthProvider>);
    expect(asFragment()).toMatchSnapshot();
  });
});
