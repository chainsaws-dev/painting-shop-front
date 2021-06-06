export interface AuthResponseData {
  Token: string;
  Email: string;
  ExpiresIn: string;
  Registered?: boolean;
  ExpirationDate?: string;
  Role: string;
  SecondFactor: TOTP;
}

export interface TOTP {
  Enabled: boolean;
  CheckResult: boolean;
}

export interface AuthRequest {
  Email: string;
  Name?: string;
  Password: string;
  ReturnSecureToken: boolean;
}
