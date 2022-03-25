import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../users.model';
import { NgForm } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Subscription } from 'rxjs';
import { ErrorResponse } from '../../../shared/shared.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

  editmode: boolean;
  index: number;
  UserToEdit: User;

  IsLoading: boolean;

  changepassword: boolean;

  private DatabaseUpdated: Subscription;
  private DataLoading: Subscription;
  private RecivedErrorSub: Subscription;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private AdminServ: UsersService,
    private auth: AuthService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private datastore: DataStorageService,
    public translate: TranslateService,
    public sitetitle: Title) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {

    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();
    this.DatabaseUpdated.unsubscribe();

  }

  ngOnInit(): void {
    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params.id != null;
        if (this.editmode) {
          this.index = +params.id;
          this.UserToEdit = this.AdminServ.GetUserById(this.index);
        } else {
          this.changepassword = true;
          this.UserToEdit = new User('guest_role_read_only', '', '', '', 'ru');
        }
        this.AdminServ.CurrentSelectedItem = this.UserToEdit;
      }
    );

    this.DatabaseUpdated = this.datastore.UserUpdateInsert.subscribe((user) => {

      if (this.editmode) {
        this.UserToEdit = user;
        this.AdminServ.UpdateExistingUser(this.UserToEdit, this.index);
      } else {
        this.UserToEdit = user;
        this.AdminServ.AddNewUser(this.UserToEdit);
      }

      setTimeout(() => this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' }), 1000);

    });

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
  }

  ChangeLanguageIfCurrentUser(lang: string) {
    if (this.UserToEdit.Email === this.auth.GetUserEmail()) {
      this.SwitchLanguage(lang);
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

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {

      if (SubmittedForm.value.changepassword && SubmittedForm.value.newpassword.length === 0) {
        return;
      }

      this.UserToEdit.Email = SubmittedForm.value.useremail;
      this.UserToEdit.Name = SubmittedForm.value.username;
      this.UserToEdit.Phone = SubmittedForm.value.userphone;
      this.UserToEdit.Role = SubmittedForm.value.roles;
      this.UserToEdit.Lang = SubmittedForm.value.userlanguage;

      this.datastore.SaveUser(this.UserToEdit, SubmittedForm.value.changepassword, SubmittedForm.value.newpassword);

    }
  }

}


