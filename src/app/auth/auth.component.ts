import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorResponse } from '../shared/shared.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  LoginMode = true;
  IsLoading = false;

  loggedIn: boolean = false;
  private authErrSub: Subscription = new Subscription;
  private loginResultSub: Subscription = new Subscription;

  ResponseFromBackend!: ErrorResponse;
  ShowMessage: boolean = false;
  MessageType!: string;

  constructor(private authservice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.authservice.CheckRegistered()) {
      this.Redirect();
    }

    this.authErrSub = this.authservice.AuthErrorSub.subscribe((response: ErrorResponse) => {
      this.ShowMessage = true;
      this.ResponseFromBackend = response;
      setTimeout(() => this.ShowMessage = false, 5000);

      if (response) {
        switch (response.Error.Code) {
          case 200:
            this.MessageType = 'success';
            break;
          default:
            this.MessageType = 'danger';
            break;
        }
      }

      this.IsLoading = false;
    });

    this.loginResultSub = this.authservice.AuthResultSub.subscribe((loggedin: boolean) => {
      this.loggedIn = loggedin;
      this.IsLoading = false;
      if (loggedin) {
        if (this.authservice.HaveToCheckSecondFactor()) {
          this.GoToSecondFactor();
        } else {
          this.Redirect();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.loginResultSub.unsubscribe();
    this.authErrSub.unsubscribe();
  }

  onSwitchMode() {
    this.LoginMode = !this.LoginMode;
  }

  OnSubmitForm(SignupForm: NgForm) {
    this.IsLoading = true;
    if (this.LoginMode) {
      this.authservice
        .SignIn(SignupForm.value.email, SignupForm.value.password);
    } else {
      this.authservice
        .SignUp(SignupForm.value.email, SignupForm.value.name, SignupForm.value.password);
    }

    SignupForm.reset();
  }

  Redirect() {
    this.router.navigate(['/recipes']);
  }

  GoToSecondFactor() {
    this.router.navigate(['/totp']);
  }

}
