import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
} from '@azure/msal-browser';
import { AuthModule, Mode } from '../AuthModule';

describe('the auth module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes on load', () => {
    const authModule = new AuthModule(Mode.Server);
    expect(authModule).toBeDefined();
  });

  describe('when logging in', () => {
    it('can login with redirect', () => {
      const spy = jest
        .spyOn(PublicClientApplication.prototype, 'loginRedirect')
        .mockImplementation(() => Promise.resolve());

      const authModule = new AuthModule(Mode.Client);
      expect(authModule.login).toBeDefined();
      authModule.login();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('when redirect fails', () => {
      it('can login with popup', async () => {
        const spy1 = jest
          .spyOn(PublicClientApplication.prototype, 'loginRedirect')
          .mockImplementation(() => Promise.reject());
        const spy2 = jest
          .spyOn(PublicClientApplication.prototype, 'loginPopup')
          .mockImplementation(() => Promise.resolve({} as AuthenticationResult));

        const authModule = new AuthModule(Mode.Client);
        expect(authModule.login).toBeDefined();
        await authModule.login();

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
      });

      describe('when popup fails', () => {
        it('fails gracefully', async () => {
          const spy1 = jest
            .spyOn(PublicClientApplication.prototype, 'loginRedirect')
            .mockImplementation(() => Promise.reject());
          const spy2 = jest
            .spyOn(PublicClientApplication.prototype, 'loginPopup')
            .mockImplementation(() => Promise.reject());

          const authModule = new AuthModule(Mode.Client);
          expect(authModule.login).toBeDefined();
          await authModule.login();

          expect(spy1).toHaveBeenCalledTimes(1);
          expect(spy2).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('when acquiring a token', () => {
    describe('if account is not found', () => {
      it('will return null for token', async () => {
        const authModule = new AuthModule(Mode.Client);
        expect(authModule.token).toBeDefined();
        const token = await authModule.token();
        expect(token).toBeNull();
      });
    });

    describe('when account is found', () => {
      it('can acquire a token', async () => {
        jest
          .spyOn(PublicClientApplication.prototype, 'acquireTokenSilent')
          .mockImplementation(() =>
            Promise.resolve({
              accessToken: '123',
            } as AuthenticationResult),
          );

        const authModule = new AuthModule(Mode.Client);
        authModule.account = {
          username: 'a@b.c',
        } as AccountInfo;
        expect(authModule.token).toBeDefined();
        const token = await authModule.token();
        expect(token).toBeDefined();
        expect(token).toEqual('123');
      });
    });

    describe('when no access token is returned', () => {
      it('will throw an InteractionRequired exception', async () => {
        jest
          .spyOn(PublicClientApplication.prototype, 'acquireTokenSilent')
          .mockImplementation(() => Promise.resolve({} as AuthenticationResult));
        const authModule = new AuthModule(Mode.Client);
        authModule.account = {
          username: 'a@b.c',
        } as AccountInfo;

        expect(authModule.token).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const token = await authModule.token().catch(() => {});
        expect(token).toBeNull();
      });
    });
  });

  describe('when logging out', () => {
    it('logs the user out', async () => {
      const spy = jest
        .spyOn(PublicClientApplication.prototype, 'logoutRedirect')
        .mockImplementation(() => Promise.resolve());
      const authModule = new AuthModule(Mode.Client);
      expect(authModule.logout).toBeDefined();
      authModule.logout();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when retrieving the active account', () => {
    it('will return the account for the logged in user', () => {
      const spy = jest
        .spyOn(PublicClientApplication.prototype, 'getAllAccounts')
        .mockImplementation(
          () =>
            [
              {
                username: 'david@federnet.com',
              },
            ] as AccountInfo[],
        );
      const authModule = new AuthModule(Mode.Client);
      expect(authModule.getActiveAccount).toBeDefined();
      const account = authModule.getActiveAccount();
      expect(account).toBeDefined();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('will return undefined if no accounts are found', () => {
      const spy = jest
        .spyOn(PublicClientApplication.prototype, 'getAllAccounts')
        .mockImplementation(() => [] as AccountInfo[]);
      const authModule = new AuthModule(Mode.Client);
      expect(authModule.getActiveAccount).toBeDefined();
      const account = authModule.getActiveAccount();
      expect(account).toBeUndefined();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the underlying library loads', () => {
    describe('when the response is null', () => {
      beforeEach(() => {
        jest
          .spyOn(PublicClientApplication.prototype, 'getAllAccounts')
          .mockImplementation(
            () =>
              [
                {
                  name: 'David Federspiel',
                  username: 'david@federnet.com',
                },
              ] as AccountInfo[],
          );
      });
      it('will retrieve the logged in account from session', async () => {
        const spy = jest
          .spyOn(PublicClientApplication.prototype, 'handleRedirectPromise')
          .mockImplementation(() => Promise.resolve(null));
        const authModule = new AuthModule(Mode.Client);
        authModule.onAccount((user) => {
          expect(user).toEqual('David Federspiel');
        });
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the response has an account', () => {
      it('will set the account from the response', () => {
        const spy = jest
          .spyOn(PublicClientApplication.prototype, 'handleRedirectPromise')
          .mockImplementation(() =>
            Promise.resolve({
              account: {
                name: 'David Federspiel',
                username: 'david@federnet.com',
              } as AccountInfo,
            } as AuthenticationResult),
          );
        const authModule = new AuthModule(Mode.Client);
        authModule.onAccount((user) => {
          expect(user).toEqual('David Federspiel');
        });
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the response throws an exception', () => {
      describe('when the error indicates password reset', () => {
        it('will redirect the user to the appropriate flow', () => {
          jest
            .spyOn(PublicClientApplication.prototype, 'handleRedirectPromise')
            .mockImplementation(() =>
              Promise.reject({
                errorMessage: 'AADB2C90118',
              }),
            );
          jest
            .spyOn(PublicClientApplication.prototype, 'loginRedirect')
            .mockImplementation(() => Promise.resolve());

          const authModule = new AuthModule(Mode.Client);
          expect(authModule).toBeDefined();
        });
      });

      describe('when the error indicates cancelled flow', () => {
        it('will redirect the user to the appropriate flow', () => {
          jest
            .spyOn(PublicClientApplication.prototype, 'handleRedirectPromise')
            .mockImplementation(() =>
              Promise.reject({
                errorMessage: 'AADB2C90077',
              }),
            );

          const authModule = new AuthModule(Mode.Client);
          expect(authModule).toBeDefined();
        });
      });
    });
  });
});
