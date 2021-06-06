import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ErrorResponse } from 'src/app/shared/shared.model';
import { FiLe } from '../media.model';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  styleUrls: ['./media-edit.component.css']
})
export class MediaEditComponent implements OnInit, OnDestroy {

  editmode: boolean = false;
  index!: number;
  FileToEdit!: FiLe;

  IsLoading: boolean = false;
  CurPercentStyle = 'width: 0%';

  private DataLoading: Subscription = new Subscription;
  private RecivedErrorSub: Subscription = new Subscription;

  FileProgress: Subscription = new Subscription;
  FileUploaded: Subscription = new Subscription;

  ShowMessage: boolean = false;
  MessageType!: string;
  Message!: string;

  constructor(
    private MediaServ: MediaService,
    private activatedroute: ActivatedRoute,
    private datastore: DataStorageService
  ) { }

  ngOnDestroy(): void {

    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();
    this.FileProgress.unsubscribe();
    this.FileUploaded.unsubscribe();

  }
  ngOnInit(): void {

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

        if (response) {
          if (response.Error) {
            this.Message = response.Error.Message;
          } else {
            this.Message = "";
          }

          setTimeout(() => this.ShowMessage = false, 5000);

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

  onFileInput(event: any) {
    this.CurPercentStyle = 'width: 0%';
    const FileToUpload = event.target.files[0] as File;
    this.datastore.FileUpload(FileToUpload);
  }

}
