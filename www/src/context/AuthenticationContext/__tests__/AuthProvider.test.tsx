import { render } from '@testing-library/react';
import { AuthProvider } from '../AuthProvider';

describe('the auth provider', () => {
  it('exists', () => {
    const { asFragment } = render(<AuthProvider>test</AuthProvider>);
    expect(asFragment()).toMatchSnapshot();
  });
});
