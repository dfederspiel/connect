import { act, fireEvent, render } from '@testing-library/react';
import { MockAuthProvider } from '../../context/MockAuthenticationContext';
import User from '../User';

describe('the user component', () => {
  describe('when the user is logged in', () => {
    const wrapper = ({ children }: any) => (
      <MockAuthProvider user="david@codefly.ninja">{children}</MockAuthProvider>
    );

    it('renders correctly with user context', () => {
      const { asFragment, getByRole } = render(<User />, { wrapper });
      expect(getByRole('button').textContent).toEqual('Logout');
      expect(asFragment()).toMatchSnapshot();
    });

    describe('and when the user clicks the logout button', () => {
      it('call the signout function', () => {
        const { getByRole } = render(<User />, { wrapper });
        act(() => {
          fireEvent.click(getByRole('button'));
        });
      });
    });
  });

  describe('when the user is not logged in', () => {
    const wrapper = ({ children }: any) => (
      <MockAuthProvider>{children}</MockAuthProvider>
    );
    it('renders correctly without user context', () => {
      const { asFragment, getByRole } = render(<User />, { wrapper });
      expect(getByRole('button').textContent).toEqual('Login');

      expect(asFragment()).toMatchSnapshot();
    });

    describe('and when the user clicks the login button', () => {
      it('call the signin function', () => {
        const { getByRole } = render(<User />, { wrapper });
        act(() => {
          fireEvent.click(getByRole('button'));
        });
      });
    });
  });
});
