import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from '../../../shared/shared.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { User } from '../users.model';
import { UsersService } from '../users.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private PageChanged: Subscription;
  private FetchOnInint: Subscription;
  private DataLoading: Subscription;

  usCurrentPage: number;
  usPageSize: number;
  usCollectionSize: number;
  IsLoading: boolean;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;
  RecivedErrorSub: Subscription;

  Users: User[];

  constructor(
    private ActiveRoute: ActivatedRoute,
    private DataServ: DataStorageService,
    public AdminServ: UsersService,
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

    this.usPageSize = environment.AdminUserListPageSize;

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
      this.usCurrentPage = +params.pn;

      this.FetchOnInint = this.DataServ.FetchUsersList(this.usCurrentPage, environment.AdminUserListPageSize).subscribe(
        (value) => {
          this.Users = this.AdminServ.GetUsers();
          this.usCollectionSize = this.AdminServ.Total;
        },
        (error) => {
          this.Users = [];
        }
      );
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
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

  OnPageChanged(page: number) {

    this.usCurrentPage = page;
    this.router.navigate(['../', page.toString()], { relativeTo: this.ActiveRoute });

  }

  OnDeleteUser(usertodelete: User, index: number): void {

    this.AdminServ.DeleteUser(index);

    this.DataServ.DeleteUser(usertodelete);

    this.Users = this.AdminServ.GetUsers();

  }

}
