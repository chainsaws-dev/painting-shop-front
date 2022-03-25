import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorResponse } from '../shared/shared.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  LoginMode = true;
  IsLoading = false;

  loggedIn: boolean;
  private authErrSub: Subscription;
  private loginResultSub: Subscription;

  ResponseFromBackend: ErrorResponse;
  ShowMessage: boolean;
  MessageType: string;

  constructor(private authservice: AuthService,
    private router: Router,
    public translate: TranslateService,
    private sitetitle: Title
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnInit(): void {

    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

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


  SwitchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("userLang", lang)

    this.translate.get("WebsiteTitleText", lang).subscribe(
      {
        next: (titletext: string) => {
          this.sitetitle.setTitle(titletext);
        },
        error: error => {
          console.log(error);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loginResultSub.unsubscribe();
    this.authErrSub.unsubscribe();
  }

  onSwitchMode() {
    this.LoginMode = !this.LoginMode;
  }

  OnSubmitForm(SignupForm: NgForm) {

    if (SignupForm.invalid) {
      this.ShowMessage = true;
      this.ResponseFromBackend = new ErrorResponse(400, this.translate.instant("IncorrectDataInput"));
      this.MessageType = 'danger';
      setTimeout(() => this.ShowMessage = false, 5000);

    } else {
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
  }

  Redirect() {
    this.router.navigate(['/recipes']);
  }

  GoToSecondFactor() {
    this.router.navigate(['/totp']);
  }

}
