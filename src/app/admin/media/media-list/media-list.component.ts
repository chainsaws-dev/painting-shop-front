import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit, OnDestroy {

  private PageChanged: Subscription;
  private FetchOnInint: Subscription;
  private DataLoading: Subscription;

  mePageSize: number;
  meCollectionSize: number;
  meCurrentPage: number;
  IsLoading: boolean;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;
  RecivedErrorSub: Subscription;

  Files: FiLe[];

  constructor(
    private ActiveRoute: ActivatedRoute,
    private DataServ: DataStorageService,
    public MediaServ: MediaService,
    private router: Router,
    private auth: AuthService,
    public translate: TranslateService,
    private sitetitle: Title
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.PageChanged.unsubscribe();
    this.DataLoading.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {
    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

    this.mePageSize = environment.MediaListPageSize;

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
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

    this.PageChanged = this.ActiveRoute.params.subscribe((params: Params) => {
      this.meCurrentPage = +params.pn;

      this.FetchOnInint = this.DataServ.FetchFilesList(this.meCurrentPage, environment.MediaListPageSize).subscribe(
        (value) => {
          this.Files = this.MediaServ.GetFiles();
          this.meCollectionSize = this.MediaServ.Total;
        },
        (error) => {
          this.Files = [];
        }
      );
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

  }

  OnPageChanged(page: number) {
    this.meCurrentPage = page;
    this.router.navigate(['../', page.toString()], { relativeTo: this.ActiveRoute });
  }

  OnDeleteFile(f: FiLe, index: number) {

    this.MediaServ.DeleteFile(index);

    this.DataServ.DeleteFile(f.ID, false);

    this.Files = this.MediaServ.GetFiles();

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
