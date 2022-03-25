import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ErrorResponse } from 'src/app/shared/shared.model';
import { environment } from 'src/environments/environment';
import { FiLe } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  styleUrls: ['./media-edit.component.css']
})
export class MediaEditComponent implements OnInit, OnDestroy {

  editmode: boolean;
  index: number;
  FileToEdit: FiLe;

  IsLoading: boolean;
  CurPercentStyle = 'width: 0%';

  private DataLoading: Subscription;
  private RecivedErrorSub: Subscription;

  FileProgress: Subscription;
  FileUploaded: Subscription;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private MediaServ: MediaService,
    private activatedroute: ActivatedRoute,
    private datastore: DataStorageService,
    public translate: TranslateService,
    private auth: AuthService,
    private sitetitle: Title

  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {

    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();
    this.FileProgress.unsubscribe();
    this.FileUploaded.unsubscribe();

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
          this.FileToEdit = this.MediaServ.GetFileById(this.index);
        } else {
          this.FileToEdit = new FiLe('', 0, '', '', '', 0);
        }
        this.MediaServ.CurrentSelectedItem = this.FileToEdit;
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

    this.FileProgress = this.datastore.FileUploadProgress.subscribe(
      (pr: string) => {
        this.CurPercentStyle = 'width: ' + pr + '%';
      }
    );

    this.FileUploaded = this.datastore.FileUploaded.subscribe(
      (res: FiLe) => {
        this.FileToEdit = res;
        this.editmode = true;
      }
    );
  }

  onFileInput(event) {
    this.CurPercentStyle = 'width: 0%';
    const FileToUpload = event.target.files[0] as File;
    this.datastore.FileUpload(FileToUpload);
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
