import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let ulang = this.auth.GetUserLocale()

    if (ulang === null) {
      ulang = environment.DefaultLocale;
    }

    if (this.auth.CheckFirstFactorPassed()) {

      const modreq = req.clone(
        {
          headers:
            req.headers.set('Auth', this.auth.GetUserToken())
              .set('ApiKey', environment.ApiKey)
              .set('Lang', ulang)
        }
      );

      return next.handle(modreq);

    } else {

      const modreq = req.clone(
        {
          headers:
            req.headers.set('ApiKey', environment.ApiKey)
              .set('Lang', ulang)
        }
      );

      return next.handle(modreq);
    }

  }

}
