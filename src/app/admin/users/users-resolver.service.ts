import { Injectable } from '@angular/core';
import { User } from './users.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersResolverService implements Resolve<User> {

  constructor(private datastorageservice: DataStorageService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
    const page = route.params.pn;
    const id = route.params.id;

    return this.datastorageservice.FetchUsersList(page, environment.AdminUserListPageSize).pipe(
      map(resp => {
        return resp.Users[id];
      }));
  }

}
