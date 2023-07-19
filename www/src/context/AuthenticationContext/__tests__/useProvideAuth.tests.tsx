import { useProvideAuth } from '../useProvideAuth';
import { renderHook } from '@testing-library/react-hooks';
import { AuthModule, Mode } from '../AuthModule';
import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
} from '@azure/msal-browser';
import { act } from '@testing-library/react';

describe('the auth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(PublicClientApplication.prototype, 'handleRedirectPromise')
      .mockImplementation(() =>
        Promise.resolve({
          account: {
            name: 'David Federspiel',
            username: 'david@federnet.com',
          } as AccountInfo,
        } as AuthenticationResult),
      );
  });

  it('sets the user when the auth module acquires it from session', async () => {
    await act(async () => {
      const authModule = new AuthModule(Mode.Client);
      const { result, waitFor } = renderHook(() => useProvideAuth(authModule));
      await waitFor(() => {
        expect(result.current.user).toEqual('David Federspiel');
      });
      expect(result.current.user).toEqual('David Federspiel');
    });
  });

  it('can sign in', async () => {
    jest
      .spyOn(AuthModule.prototype, 'onAccount')
      .mockImplementation(() => Promise.resolve());
    const spy = jest
      .spyOn(AuthModule.prototype, 'login')
      .mockImplementation(() => Promise.resolve());
    const authModule = new AuthModule(Mode.Client);
    authModule.account = {
      name: 'David Federspiel',
    } as AccountInfo;
    act(() => {
      const { result } = renderHook(() => useProvideAuth(authModule));
      result.current.login();
      result.current.login();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
  it('can sign out', () => {
    jest
      .spyOn(AuthModule.prototype, 'onAccount')
      .mockImplementation(() => Promise.resolve());
    const spy = jest
      .spyOn(AuthModule.prototype, 'logout')
      .mockImplementation(() => Promise.resolve());
    const authModule = new AuthModule(Mode.Client);
    authModule.account = {
      name: 'David Federspiel',
    } as AccountInfo;
    act(() => {
      const { result } = renderHook(() => useProvideAuth(authModule));
      result.current.logout();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('can acquire a token', async () => {
    jest
      .spyOn(AuthModule.prototype, 'onAccount')
      .mockImplementation(() => Promise.resolve());
    const spy = jest
      .spyOn(AuthModule.prototype, 'token')
      .mockImplementation(() => Promise.resolve('123'));
    const authModule = new AuthModule(Mode.Client);
    authModule.account = {
      name: 'David Federspiel',
    } as AccountInfo;
    await act(async () => {
      const { result } = renderHook(() => useProvideAuth(authModule));
      const token = await result.current.token(false);
      expect(token).toEqual('123');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('when a token is not found', () => {
    it('will return null instead of a token', async () => {
      const spy = jest
        .spyOn(AuthModule.prototype, 'token')
        .mockImplementation(() => Promise.reject());
      const authModule = new AuthModule(Mode.Client);
      authModule.account = {
        name: 'David Federspiel',
      } as AccountInfo;
      await act(async () => {
        const { result } = renderHook(() => useProvideAuth(authModule));
        const token = await result.current.token(false);
        expect(token).toBeNull();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
