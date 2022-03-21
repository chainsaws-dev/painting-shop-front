// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  NoAuthGuard: true,
  PageTitle: "Paintings shop",
  AdminUserListPageSize: 11,
  SessionsListPageSize: 11,
  MediaListPageSize: 12,
  ApiKey: 'AIzaSyB3Jr8tp5wotjeS-re9iBSgX2b1zbM0Fx4',
  ConfirmEmailUrl: '/api/v1/ConfirmEmail',
  ResendEmailUrl: '/api/v1/ConfirmEmail/Send',
  ResetPasswordUrl: '/api/v1/PasswordReset',
  SendEmailResetPassUrl: '/api/v1/PasswordReset/Send',
  SignUpUrl: '/api/v1/Accounts/SignUp',
  SignInUrl: '/api/v1/Accounts/SignIn',
  GetSetFileUrl: '/api/v1/Files',
  GetSetUsersUrl: '/api/v1/Users',
  GetSetCurrentUserUrl: '/api/v1/Users/Current',
  GetSetSessionsUrl: '/api/v1/Sessions',
  GetTOTPQRCodeUrl: '/api/v1/TOTP/Qr.png',
  TOTPSettingsUrl: '/api/v1/TOTP/Settings',
  TOTPCheckUrl: '/api/v1/TOTP/Check',
  GetAuthenticatorUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
