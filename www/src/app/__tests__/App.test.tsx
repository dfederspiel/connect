import { act, fireEvent, render } from '@testing-library/react';
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

  it('opens the app bar on click', async () => {
    const { findByLabelText } = render(<App />);
    const menuButton = await findByLabelText('open drawer');
    expect(menuButton).toBeDefined();
    act(() => {
      fireEvent.click(menuButton);
    });
    const closeButton = await findByLabelText('menu close');
    act(() => {
      fireEvent.click(closeButton);
    });
  });
});
