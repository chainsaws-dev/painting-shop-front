import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from '../shared/shared.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

  IsLoading = false;

  ResponseFromBackend: ErrorResponse;

  ShowMessage: boolean;
  MessageType: string;

  RecivedErrorSub: Subscription;
  RecivedResponseSub: Subscription;
  DataServiceSub: Subscription;

  Token: string;

  ResetPasswordMode: boolean;

  constructor(
    private DataServ: DataStorageService,
    private activeroute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private sitetitle: Title) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.RecivedResponseSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
  }

  ngOnInit(): void {

    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
      (response) => {

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
      }
    );

    this.activeroute.queryParams.subscribe((Qparams: Params) => {

      this.Token = Qparams.Token;

      const cururl = this.getUrlWithoutParams();

      this.ResetPasswordMode = cururl === '/reset-password';

      if (!this.ResetPasswordMode) {
        if (this.Token) {
          this.DataServ.ConfirmEmail(this.Token);
        }
      }
    }
    );
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

  getUrlWithoutParams() {
    const urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams = {};
    return urlTree.toString();
  }

  OnSubmitForm(ResendConfEmailForm: NgForm) {
    if (ResendConfEmailForm.valid) {

      this.IsLoading = true;

      if (this.ResetPasswordMode && this.Token) {
        this.DataServ.SubmitNewPassword(this.Token, ResendConfEmailForm.value.newpassword);
      } else {
        if (this.ResetPasswordMode) {
          this.DataServ.SendEmailResetPassword(ResendConfEmailForm.value.email);
        } else {
          this.DataServ.SendEmailConfirmEmail(ResendConfEmailForm.value.email);
        }
      }

      ResendConfEmailForm.reset();

    }

  }
}
