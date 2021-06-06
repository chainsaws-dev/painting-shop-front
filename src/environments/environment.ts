// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AdminUserListPageSize: 11,
  SessionsListPageSize: 11,
  MediaListPageSize: 12,
  ApiKey: 'AIzaSyB3Jr8tp5wotjeS-re9iBSgX2b1zbM0Fx4',
  ConfirmEmailUrl: '/api/ConfirmEmail',
  ResendEmailUrl: '/api/ConfirmEmail/Send',
  ResetPasswordUrl: '/api/PasswordReset',
  SendEmailResetPassUrl: '/api/PasswordReset/Send',
  SignUpUrl: '/api/Accounts/SignUp',
  SignInUrl: '/api/Accounts/SignIn',
  GetSetFileUrl: '/api/Files',
  GetSetUsersUrl: '/api/Users',
  GetSetCurrentUserUrl: '/api/Users/Current',
  GetSetSessionsUrl: '/api/Sessions',
  GetTOTPQRCodeUrl: '/api/TOTP/Qr.png',
  TOTPSettingsUrl: '/api/TOTP/Settings',
  TOTPCheckUrl: '/api/TOTP/Check',
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
