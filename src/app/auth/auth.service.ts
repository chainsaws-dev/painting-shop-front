import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthResponseData, AuthRequest } from './auth.module';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ErrorResponse } from '../shared/shared.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData!: AuthResponseData;
  private autoRefreshToken: any;

  public AuthErrorSub = new Subject<ErrorResponse>();
  public AuthResultSub = new Subject<boolean>();
  private authObs!: Observable<AuthResponseData>;

  public SfErrorSub = new Subject<ErrorResponse>();
  public SfResultSub = new Subject<boolean>();
  private SecFactorObs!: Observable<ErrorResponse>;


  constructor(
    private http: HttpClient,
    private router: Router) { }

  SignUp(UserEmail: string, Name: string, Password: string) {

    const signup: AuthRequest = {
      Email: UserEmail,
      Name: encodeURI(Name),
      Password: encodeURI(Password),
      ReturnSecureToken: true,
    };

    this.authObs = this.http.post<AuthResponseData>(
      environment.SignUpUrl, signup);

    this.RequestSub();
  }

  SignIn(UserEmail: string, Password: string) {

    const signin: AuthRequest = {
      Email: UserEmail,
      Password: encodeURI(Password),
      ReturnSecureToken: true,
    };

    this.authObs = this.http.post<AuthResponseData>(
      environment.SignInUrl, signin);

    this.RequestSub();
  }

  SecondFactorCheck(Passkey: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Passcode: Passkey
      })
    };

    this.SecFactorObs = this.http.post<ErrorResponse>(
      environment.TOTPCheckUrl, null, httpOptions);

    this.SecFactorObs.subscribe(
      response => {

        if (response.Error.Code === 200) {
          this.authData.SecondFactor.CheckResult = true;
        } else {
          this.authData.SecondFactor.CheckResult = false;
        }

        localStorage.setItem('userData', JSON.stringify(this.authData));

        this.SfResultSub.next(this.authData.SecondFactor.CheckResult);
        this.SfErrorSub.next(response);

      }, error => {

        const errresp = error.error as ErrorResponse;
        this.authData.SecondFactor.CheckResult = false;

        this.SfResultSub.next(false);
        this.SfErrorSub.next(errresp);

      }
    );
  }

  SignOut() {
    this.authData = {} as AuthResponseData;
    if (this.autoRefreshToken) {
      clearTimeout(this.autoRefreshToken);
    }

    localStorage.removeItem('userData');

    this.AuthResultSub.next(false);
    this.SfResultSub.next(false);

    this.router.navigate(['/auth']);
  }

  AutoSignIn() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      return;
    } else {
      this.authData = JSON.parse(userData);

      const ExpDur = new Date(this.authData.ExpirationDate ?? "").getTime() -
        new Date().getTime();

      this.AuthResultSub.next(true);
      this.AutoSignOut(ExpDur);
    }
  }

  private AutoSignOut(ExpiresIn: number) {
    this.autoRefreshToken = setTimeout(() => {
      this.SignOut();
    }, ExpiresIn);
  }

  private RequestSub() {
    this.authObs.subscribe(
      response => {
        this.authData = response;
        this.authData.ExpirationDate = String(new Date(new Date().getTime() + +this.authData.ExpiresIn * 1000));
        localStorage.setItem('userData', JSON.stringify(this.authData));
        this.AuthResultSub.next(response.Registered);
        this.AutoSignOut(+this.authData.ExpiresIn * 1000);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.AuthResultSub.next(false);
        this.AuthErrorSub.next(errresp);
      }
    );
  }

  CheckRegistered() {
    if (this.authData !== null && this.authData !== undefined) {
      if (this.authData.SecondFactor.Enabled === true) {
        return this.authData.SecondFactor.CheckResult && this.authData.Registered;
      } else {
        return this.authData.Registered;
      }
    } else {
      return false;
    }
  }

  CheckFirstFactorPassed() {
    if (this.authData !== null) {
      return this.authData.Registered;
    } else {
      return false;
    }
  }

  HaveToCheckSecondFactor() {
    if (this.authData !== null) {
      if (this.authData.SecondFactor.Enabled) {
        return !this.authData.SecondFactor.CheckResult;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  CheckTokenExpired() {
    if (this.authData.ExpirationDate !== '' && this.authData.ExpirationDate !== null) {
      return !(new Date() > new Date(this.authData.ExpirationDate ?? ""));
    }
    else {
      return false;
    }
  }

  GetUserToken() {
    if (this.CheckTokenExpired()) {
      return this.authData.Token;
    } else {
      return null;
    }
  }

  GetUserEmail() {
    if (this.authData) {
      return this.authData.Email;
    } else {
      return null;
    }
  }

  GetUserRole() {
    if (this.authData) {
      return this.authData.Role;
    } else {
      return null;
    }
  }

  CheckIfUserIsAdmin() {
    if (this.GetUserRole() === 'admin_role_CRUD') {
      return true;
    }

    return false;
  }
}


