import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../admin/users/users.model';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { ErrorResponse } from '../shared/shared.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  index: number;

  UserToEdit: User;

  TwoFactorEnabled: boolean;

  SetTwoFactor: boolean;

  IsLoading: boolean;
  changepassword: boolean;

  AuthUrl: string;
  QrUrl: string;



  private DataLoading: Subscription;
  private RecivedErrorSub: Subscription;

  private FetchUser: Subscription;
  private SaveUser: Subscription;

  private LinkUnlinkTFA: Subscription;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private auth: AuthService,
    private datastore: DataStorageService,
    private sitetitle: Title,
    public translate: TranslateService) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {
    this.FetchUser.unsubscribe();
    this.RecivedErrorSub.unsubscribe();
    this.DataLoading.unsubscribe();
    this.SaveUser.unsubscribe();
    this.LinkUnlinkTFA.unsubscribe();
  }

  ngOnInit(): void {

    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

    this.AuthUrl = environment.GetAuthenticatorUrl;
    this.QrUrl = environment.GetTOTPQRCodeUrl;

    this.LinkUnlinkTFA = this.datastore.TwoFactorSub.subscribe(
      (ThisUser) => {
        this.SetUserAndTFA(ThisUser);
      }
    );

    this.SaveUser = this.datastore.UserUpdateInsert.subscribe(
      (ThisUser) => {
        this.SetUserAndTFA(ThisUser);
      }
    );

    this.FetchUser = this.datastore.CurrentUserFetch.subscribe(
      (ThisUser) => {
        this.SetUserAndTFA(ThisUser);
      }
    );

    this.RecivedErrorSub = this.datastore.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => {
          this.ShowMessage = false;
          if (response.Error.Code === 401 || response.Error.Code === 403 || response.Error.Code === 407) {
            this.auth.SignOut();
          }
        }, environment.MessageTimeout);

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

    this.DataLoading = this.datastore.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.datastore.FetchCurrentUser();
  }

  SetUserAndTFA(ThisUser: User) {
    this.UserToEdit = ThisUser;

    if (this.UserToEdit) {
      this.TwoFactorEnabled = this.UserToEdit.SecondFactor;
    }
  }

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {

      if (SubmittedForm.value.changepassword && SubmittedForm.value.newpassword.length === 0) {
        return;
      }

      this.UserToEdit.Email = SubmittedForm.value.useremail;
      this.UserToEdit.Name = SubmittedForm.value.username;
      this.UserToEdit.Phone = SubmittedForm.value.userphone;
      this.UserToEdit.Lang = SubmittedForm.value.userlanguage;

      this.datastore.SaveCurrentUser(this.UserToEdit, SubmittedForm.value.changepassword, SubmittedForm.value.newpassword);

    }
  }

  OnLinkTwoFactor(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {
      this.datastore.LinkTwoFactor(SubmittedForm.value.passkey, this.UserToEdit);
    }
  }

  OnUnlinkTwoFactor() {

    if (this.UserToEdit.SecondFactor) {
      this.datastore.UnlinkTwoFactor(this.UserToEdit);
    }

  }

  SwitchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("userLang", lang)
    this.auth.ChangeLocale(lang)

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
