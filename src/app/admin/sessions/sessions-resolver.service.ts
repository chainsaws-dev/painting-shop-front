import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Session } from '../sessions/sessions.model';

@Injectable({
  providedIn: 'root'
})
export class SessionsResolverService implements Resolve<Session> {

  constructor(private datastorageservice: DataStorageService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Session | Observable<Session> | Promise<Session> {
    const page = route.params.pn;
    const id = route.params.id;

    return this.datastorageservice.FetchSessionsList(page, environment.SessionsListPageSize).pipe(
      map(resp => {
        return resp.Sessions[id];
      }));
  }

}
