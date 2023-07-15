import { render } from '@testing-library/react';
import App from '../App';
import 'cross-fetch/polyfill';

beforeAll(() => {
  process.env.APOLLO_HOST = 'http://localhost/graphql';
  process.env.APOLLO_WS_HOST = 'ws://localhost/ws';
});

describe('the app component', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
