import { Configuration, LogLevel } from '@azure/msal-browser';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: process.env.B2C_APPLICATION_ID || '',
    authority: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}`,
    redirectUri: `${window.location.protocol}//${window.location.host}/login`,
    postLogoutRedirectUri: `${window.location.protocol}//${window.location.host}/login`,
    navigateToLoginRequestUrl: true,
    knownAuthorities: [process.env.B2C_KNOWN_AUTHORITIES || ''],
    cloudDiscoveryMetadata: '',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  // system: {
  //   loggerOptions: {
  //     loggerCallback: (level, message, containsPii) => {
  //       if (containsPii) {
  //         return;
  //       }
  //       switch (level) {
  //         case LogLevel.Error:
  //           console.error(message);
  //           return;
  //         case LogLevel.Info:
  //           console.info(message);
  //           return;
  //         case LogLevel.Verbose:
  //           console.debug(message);
  //           return;
  //         case LogLevel.Warning:
  //           console.warn(message);
  //           return;
  //       }
  //     },
  //   },
  // },
};

export const LOGIN_REQUEST = {
  scopes: ['openid', 'offline_access', process.env.B2C_SCOPE],
  forceRefresh: false,
};
