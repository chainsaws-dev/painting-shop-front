export const environment = {
  production: true,
  DefaultLocale: 'ru',
  SupportedLangs: ['ru', 'en'],
  MessageTimeout: 2000,
  RecipePageSize: 5,
  ShoppingListPageSize: 18,
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
  GetSetRecipesUrl: '/api/v1/Recipes',
  GetSetFileUrl: '/api/v1/Files',
  SearchRecipesUrl: '/api/v1/Recipes/Search',
  GetSetShoppingListUrl: '/api/v1/ShoppingList',
  GetSetUsersUrl: '/api/v1/Users',
  GetSetCurrentUserUrl: '/api/v1/Users/Current',
  GetSetSessionsUrl: '/api/v1/Sessions',
  GetTOTPQRCodeUrl: '/api/v1/TOTP/Qr.png',
  TOTPSettingsUrl: '/api/v1/TOTP/Settings',
  TOTPCheckUrl: '/api/v1/TOTP/Check',
  GetAuthenticatorUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
};
