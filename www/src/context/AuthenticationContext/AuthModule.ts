import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  PopupRequest,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser';
import { MSAL_CONFIG, LOGIN_REQUEST } from './constants';

const RESET_POLICY = `${process.env.B2C_AUTHORITY}/${process.env.B2C_RESET_POLICY}`;

const redirectRequest: RedirectRequest = {
  scopes: ['openid', 'offline_access', process.env.B2C_SCOPE || ''],
  redirectUri: `${window.location.protocol}//${window.location.host}/login`,
  authority: RESET_POLICY,
  redirectStartPage: `${window.location.protocol}//${window.location.host}/login`,
};

export enum Mode {
  Client,
  Server,
}
export class AuthModule {
  private client: PublicClientApplication;
  private cb?: (user?: string) => void;
  account?: AccountInfo | null;

  constructor(mode: Mode) {
    this.client = new PublicClientApplication(MSAL_CONFIG);
    /**
     * Only register the redirect handler if running in client mode
     */
    if (mode === Mode.Client) {
      this.registerRedirectHandler();
    }
  }

  onAccount(cb: (user?: string) => void): void {
    this.cb = cb;
  }

  login(): void {
    this.client
      .loginRedirect({
        ...LOGIN_REQUEST,
        ...{
          authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}`,
          redirectUri: `${window.location.protocol}//${window.location.host}`,
        },
      } as RedirectRequest)
      .catch(() => {
        this.client
          .loginPopup({
            ...LOGIN_REQUEST,
            ...{
              authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}`,
              redirectUri: `${window.location.protocol}//${window.location.host}`,
            },
          } as PopupRequest)
          .catch((ex) => {
            console.log(ex);
          });
      });
  }

  async token(): Promise<string | null> {
    if (!this.account) return null;

    return this.client
      .acquireTokenSilent({
        account: this.account,
        ...LOGIN_REQUEST,
        authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}`,
      } as SilentRequest)
      .then((result) => {
        if (!result.accessToken || result.accessToken === '') {
          throw new InteractionRequiredAuthError();
        }
        return result.accessToken;
      })
      .catch(() => {
        this.client
          .acquireTokenRedirect({
            account: this.account,
            ...LOGIN_REQUEST,
            authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}`,
          } as RedirectRequest)
          .catch((ex) => {
            console.log(ex);
          });
        return null;
      });
  }

  async logout(): Promise<void> {
    this.client
      .logoutRedirect({
        postLogoutRedirectUri: `${window.location.protocol}//${window.location.host}`,
        authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_RESET_POLICY}`,
      })
      .then(() => {
        console.log('logged out');
      });
  }

  getActiveAccount(): AccountInfo | void {
    if (this.client.getAllAccounts().length > 0) {
      return this.client.getAllAccounts()[0];
    }
  }

  registerRedirectHandler(): void {
    this.client
      .handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        if (response === null) {
          this.client.getAllAccounts().forEach((acct) => {
            this.account = acct;
            this.cb && this.cb(this.account.name);
          });
        } else {
          this.account = response.account;
          this.account && this.cb && this.cb(this.account.name);
        }
      })
      .catch((err) => {
        if (err.errorMessage.indexOf('AADB2C90118') > -1) {
          // Password reset
          this.client.loginRedirect(redirectRequest).catch((err) => {
            console.log(err);
          });
        }
        if (err.errorMessage.indexOf('AADB2C90077') > -1) {
        }
      });
  }
}
