import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ErrorResponse } from '../shared/shared.model';

@Component({
  selector: 'app-totp',
  templateUrl: './totp.component.html',
  styleUrls: ['./totp.component.css']
})
export class TotpComponent implements OnInit, OnDestroy {

  LoginMode = true;
  IsLoading = false;

  private SfErrSub: Subscription;
  private SfResultSub: Subscription;

  ResponseFromBackend: ErrorResponse;
  ShowMessage: boolean;
  MessageType: string;

  constructor(
    private authservice: AuthService,
    private router: Router,
    public translate: TranslateService,
    private sitetitle: Title) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {
    this.SfResultSub.unsubscribe();
    this.SfErrSub.unsubscribe();
  }

  ngOnInit(): void {

    if (this.authservice.CheckRegistered()) {
      this.Redirect();
    }

    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }



    this.SfErrSub = this.authservice.SfErrorSub.subscribe((response: ErrorResponse) => {
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

    this.SfResultSub = this.authservice.SfResultSub.subscribe((Success: boolean) => {
      this.IsLoading = false;
      if (Success) {
        this.Redirect();
      }
    });
  }


  OnSubmitForm(SignupForm: NgForm) {

    this.IsLoading = true;

    this.authservice.SecondFactorCheck(SignupForm.value.passkey);

    SignupForm.reset();

  }

  Redirect() {
    this.router.navigate(['/recipes']);
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
}
