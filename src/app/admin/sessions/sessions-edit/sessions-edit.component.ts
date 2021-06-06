import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ErrorResponse } from 'src/app/shared/shared.model';
import { Session } from '../sessions.model';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions-edit',
  templateUrl: './sessions-edit.component.html',
  styleUrls: ['./sessions-edit.component.css']
})
export class SessionsEditComponent implements OnInit, OnDestroy {


  editmode: boolean = false;
  index!: number;
  SessionToEdit: Session = new Session;

  IsLoading: boolean = false;

  private DataLoading: Subscription = new Subscription;
  private RecivedErrorSub: Subscription = new Subscription;

  ShowMessage: boolean = false;
  MessageType!: string;
  Message!: string;

  constructor(
    private SessServ: SessionsService,
    private activatedroute: ActivatedRoute,
    private datastore: DataStorageService) { }

  ngOnDestroy(): void {

    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();

  }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params.id != null;
        if (this.editmode) {
          this.index = +params.id;
          this.SessionToEdit = this.SessServ.GetSessionById(this.index);
        }
        this.SessServ.CurrentSelectedItem = this.SessionToEdit;
      }
    );

    this.RecivedErrorSub = this.datastore.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;

        if (response) {
          if (response.Error) {
            this.Message = response.Error.Message[0].toUpperCase() + response.Error.Message.slice(1);
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
  }


}
