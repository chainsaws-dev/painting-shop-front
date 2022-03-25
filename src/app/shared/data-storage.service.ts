import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';

import { ErrorResponse, Pagination } from '../shared/shared.model';
import { FiLe, FilesResponse } from '../admin/media/media.model';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { ShoppingListResponse, Ingredient } from './shared.model';
import { UsersResponse, User } from '../admin/users/users.model';

import { UsersService } from '../admin/users/users.service';
import { MediaService } from '../admin/media/media.service';
import { SessionsResponse } from '../admin/sessions/sessions.model';
import { SessionsService } from '../admin/sessions/sessions.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  LoadingData = new Subject<boolean>();

  RecivedError = new Subject<ErrorResponse>();
  PaginationSet = new Subject<Pagination>();
  FileUploadProgress = new Subject<string>();
  FileUploaded = new Subject<FiLe>();
  UserUpdateInsert = new Subject<User>();

  CurrentUserFetch = new Subject<User>();

  TwoFactorSub = new Subject<User>();

  LastPagination: Pagination;

  Searched: boolean;

  constructor(
    private http: HttpClient,
    private users: UsersService,
    private media: MediaService,
    private sessions: SessionsService,
    private translate: TranslateService) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  GetLanguageSelected() {
    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }
  }

  SwitchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("userLang", lang)
  }



  FetchFilesList(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<FilesResponse>(environment.GetSetFileUrl, httpOptions)
      .pipe(
        tap(
          {
            next: recresp => {
              this.media.SetFiles(recresp.Files);
              this.media.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
              this.LoadingData.next(false);
            },
            error: (error) => {
              const errresp = error.error as ErrorResponse;
              this.RecivedError.next(errresp);
              this.LoadingData.next(false);
            }
          }
        )
      );
  }

  FileUpload(FileToUpload: File) {
    const formdatafile = new FormData();
    formdatafile.append('file', FileToUpload, FileToUpload.name);
    this.http.post(environment.GetSetFileUrl, formdatafile, {
      headers: new HttpHeaders({

      }),
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      {
        next: (curevent: any) => {
          if (curevent.type === HttpEventType.UploadProgress) {
            this.FileUploadProgress.next(String(curevent.loaded / curevent.total * 100));
          } else if (curevent.type === HttpEventType.Response) {
            if (curevent.ok) {
              this.FileUploaded.next(curevent.body as FiLe);
            }
          }
        },
        error: error => {
          const errresp = error.error as ErrorResponse;
          this.RecivedError.next(errresp);
          this.LoadingData.next(false);
        }
      }
    );
  }

  DeleteFile(FileID: number, NoMessage: boolean) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        FileID: FileID.toString()
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetFileUrl, httpOptions)
      .subscribe(
        {
          next: response => {
            if (!NoMessage) {
              this.RecivedError.next(response);
            }

            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

 

  FetchSessionsList(page: number, limit: number) {

    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<SessionsResponse>(environment.GetSetSessionsUrl, httpOptions)
      .pipe(
        tap(
          {
            next: recresp => {
              this.sessions.SetSessions(recresp.Sessions);
              this.sessions.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
              this.LoadingData.next(false);
            },
            error: (error) => {
              const errresp = error.error as ErrorResponse;
              this.RecivedError.next(errresp);
              this.LoadingData.next(false);
            }
          }
        )
      );
  }

  DeleteSessionByToken(token: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Token: token
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetSessionsUrl, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  DeleteSessionByEmail(email: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Email: email
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetSessionsUrl, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  FetchUsersList(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<UsersResponse>(environment.GetSetUsersUrl, httpOptions)
      .pipe(
        tap(
          {
            next: recresp => {
              this.users.SetUsers(recresp.Users);
              this.users.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
              this.LoadingData.next(false);
            },
            error: (error) => {
              const errresp = error.error as ErrorResponse;
              this.RecivedError.next(errresp);
              this.LoadingData.next(false);
            }
          }
        )
      );
  }

  FetchCurrentUser() {
    this.LoadingData.next(true);

    return this.http.get<User>(environment.GetSetCurrentUserUrl)
      .subscribe(
        {
          next: response => {
            this.CurrentUserFetch.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  SaveCurrentUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    this.LoadingData.next(true);

    if (ItemToSave.GUID.length === 0) {
      ItemToSave.GUID = '00000000-0000-0000-0000-000000000000';
    }

    this.GetObsForSaveCurrentUser(ItemToSave, ChangePassword, NewPassword)
      .subscribe(
        {
          next: response => {
            this.UserUpdateInsert.next(response);
            this.GetLanguageSelected();
            this.RecivedError.next(new ErrorResponse(200, this.translate.instant('DataSaved')));
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  SaveUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    this.LoadingData.next(true);

    if (ItemToSave.GUID.length === 0) {
      ItemToSave.GUID = '00000000-0000-0000-0000-000000000000';
    }

    this.GetObsForSaveUser(ItemToSave, ChangePassword, NewPassword)
      .subscribe(
        {
          next: response => {
            this.UserUpdateInsert.next(response);
            this.GetLanguageSelected();
            this.RecivedError.next(new ErrorResponse(200, this.translate.instant('DataSaved')));
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  LinkTwoFactor(Key: string, CurUser: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        Passcode: Key
      })
    };

    this.http.post<ErrorResponse>(environment.TOTPSettingsUrl, CurUser, httpOptions)
      .subscribe(
        {
          next: response => {
            CurUser.SecondFactor = true;
            this.TwoFactorSub.next(CurUser);
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  UnlinkTwoFactor(CurUser: User) {
    this.http.delete<ErrorResponse>(environment.TOTPSettingsUrl)
      .subscribe(
        {
          next: response => {
            CurUser.SecondFactor = false;
            this.TwoFactorSub.next(CurUser);
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  GetObsForSaveCurrentUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    if (ChangePassword) {
      const httpOptions = {
        headers: new HttpHeaders({
          NewPassword: encodeURI(NewPassword)
        })
      };

      return this.http.post<User>(environment.GetSetCurrentUserUrl, ItemToSave, httpOptions);
    } else {
      return this.http.post<User>(environment.GetSetCurrentUserUrl, ItemToSave);
    }
  }

  GetObsForSaveUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    if (ChangePassword) {
      const httpOptions = {
        headers: new HttpHeaders({
          NewPassword: encodeURI(NewPassword)
        })
      };

      return this.http.post<User>(environment.GetSetUsersUrl, ItemToSave, httpOptions);
    } else {
      return this.http.post<User>(environment.GetSetUsersUrl, ItemToSave);
    }
  }

  DeleteUser(UserToDelete: User) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        UserID: encodeURI(UserToDelete.GUID)
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetUsersUrl, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }


  ConfirmEmail(UniqueToken: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Token: UniqueToken
      })
    };

    this.http.post<ErrorResponse>(environment.ConfirmEmailUrl, null, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  SendEmailConfirmEmail(EmailToSend: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Email: EmailToSend
      })
    };

    this.http.post<ErrorResponse>(environment.ResendEmailUrl, null, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  SendEmailResetPassword(EmailToSend: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Email: EmailToSend
      })
    };

    this.http.post<ErrorResponse>(environment.SendEmailResetPassUrl, null, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }

  SubmitNewPassword(UniqueToken: string, NewPass: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Token: UniqueToken,
        NewPassword: encodeURI(NewPass)
      })
    };

    this.http.post<ErrorResponse>(environment.ResetPasswordUrl, null, httpOptions)
      .subscribe(
        {
          next: response => {
            this.RecivedError.next(response);
            this.LoadingData.next(false);
          },
          error: error => {
            const errresp = error.error as ErrorResponse;
            this.RecivedError.next(errresp);
            this.LoadingData.next(false);
          }
        }
      );
  }
}



