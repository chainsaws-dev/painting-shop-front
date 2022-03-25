import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ErrorResponse } from 'src/app/shared/shared.model';
import { environment } from 'src/environments/environment';
import { Session } from '../sessions.model';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions-edit',
  templateUrl: './sessions-edit.component.html',
  styleUrls: ['./sessions-edit.component.css']
})
export class SessionsEditComponent implements OnInit, OnDestroy {


  editmode: boolean;
  index: number;
  SessionToEdit: Session;

  IsLoading: boolean;

  private DataLoading: Subscription;
  private RecivedErrorSub: Subscription;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private SessServ: SessionsService,
    private activatedroute: ActivatedRoute,
    private datastore: DataStorageService,
    private auth: AuthService,
    public translate: TranslateService,
    private sitetitle: Title) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {

    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();

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
          this.SessionToEdit = this.SessServ.GetSessionById(this.index);
        }
        this.SessServ.CurrentSelectedItem = this.SessionToEdit;
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
