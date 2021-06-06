import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { FiLe } from './media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaResolverService implements Resolve<FiLe> {

  constructor(private datastorageservice: DataStorageService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): FiLe | Observable<FiLe> | Promise<FiLe> {
    const page = route.params.pn;
    const id = route.params.id;

    return this.datastorageservice.FetchFilesList(page, environment.MediaListPageSize).pipe(
      map(resp => {
        return resp.Files[id];
      }));
  }

}
