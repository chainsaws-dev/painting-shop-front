import { Injectable } from '@angular/core';
import { FiLe } from './media.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  FileSelected = new Subject<FiLe>();
  FilesUpdated = new Subject<void>();
  FilesInserted = new Subject<void>();
  FilesDeleted = new Subject<void>();
  FilesChanged = new Subject<FiLe>();

  CurrentSelectedItem!: FiLe;
  Total!: number;


  private Files: FiLe[] = [];

  constructor() { }

  GetFiles() {
    return this.Files.slice();
  }

  SetFiles(newfiles: FiLe[]) {
    this.Files = newfiles;
    this.FilesUpdated.next();
  }

  SetPagination(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
  }

  SelectItemFilesList(f: FiLe) {
    this.CurrentSelectedItem = f;
    this.FileSelected.next(f);
  }

  IsCurrentSelected(user: FiLe) {
    return this.CurrentSelectedItem === user;
  }

  GetFileById(id: number) {

    if (id < this.Files.length && id > 0) {
      return this.Files[id];
    } else {
      return this.Files[0];
    }
  }

  UpdateExistingFile(f: FiLe, Index: number) {
    this.Files[Index] = f;
    this.FilesChanged.next(f);
  }

  AddNewFile(f: FiLe) {

    const nf = new FiLe(f.Filename, f.Filesize, f.Filetype, f.FileID, f.PreviewID, f.ID);

    if (this.Files.length < environment.AdminUserListPageSize) {
      this.Files.push(nf);
    }

    this.FilesChanged.next(nf);
    this.FilesInserted.next();
  }

  DeleteFile(Index: number) {
    this.Files.splice(Index, 1);
    this.FilesDeleted.next();
  }

}

