import { MockAuthProvider } from '../../context/MockAuthenticationContext';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';

describe('the private route', () => {
  it('blocks unauthenticated access', () => {
    const { asFragment } = render(
      <MockAuthProvider>
        <MemoryRouter>
          <PrivateRoute>This will NOT be in the snapshot</PrivateRoute>
        </MemoryRouter>
      </MockAuthProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('allows authenticated access', () => {
    const { asFragment } = render(
      <MockAuthProvider user="user@contoso.com">
        <MemoryRouter>
          <PrivateRoute>This will be in the snapshot</PrivateRoute>
        </MemoryRouter>
      </MockAuthProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
