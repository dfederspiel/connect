import { render } from '@testing-library/react';
import { MockAuthProvider } from '../MockAuthProvider';

describe('the mocked auth provider', () => {
  it('exists', () => {
    const { asFragment } = render(<MockAuthProvider user="Joe Black"></MockAuthProvider>);
    expect(asFragment()).toMatchSnapshot();
  });
});
