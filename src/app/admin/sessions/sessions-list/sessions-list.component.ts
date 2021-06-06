import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ErrorResponse } from 'src/app/shared/shared.model';
import { environment } from 'src/environments/environment';
import { Session } from '../sessions.model';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.css']
})
export class SessionsListComponent implements OnInit, OnDestroy {

  private PageChanged!: Subscription;
  private FetchOnInint!: Subscription;
  private DataLoading!: Subscription;

  sesCurrentPage!: number;
  sesPageSize!: number;
  sesCollectionSize!: number;
  IsLoading!: boolean;

  ShowMessage!: boolean;
  MessageType!: string;
  ResponseFromBackend!: ErrorResponse;
  RecivedErrorSub!: Subscription;

  Sessions!: Session[];

  constructor(
    private ActiveRoute: ActivatedRoute,
    private DataServ: DataStorageService,
    public SessServ: SessionsService,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.PageChanged.unsubscribe();
    this.DataLoading.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {
    this.sesPageSize = environment.SessionsListPageSize;

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => this.ShowMessage = false, 5000);

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
      this.sesCurrentPage = +params.pn;
      this.GetRecentData();
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

  }

  GetRecentData() {
    this.FetchOnInint = this.DataServ.FetchSessionsList(this.sesCurrentPage, environment.SessionsListPageSize).subscribe(
      (value) => {
        this.Sessions = this.SessServ.GetSessions();
        this.sesCollectionSize = this.SessServ.Total;
      },
      (error) => {
        this.Sessions = [];
      }
    );
  }

  OnPageChanged(page: number) {

    this.sesCurrentPage = page;
    this.router.navigate(['../', page.toString()], { relativeTo: this.ActiveRoute });

  }

  OnDeleteSession(SessionToDelete: Session, index: number): void {

    this.SessServ.DeleteSession(index);

    this.DataServ.DeleteSessionByToken(SessionToDelete.Token);

    this.Sessions = this.SessServ.GetSessions();

  }

  OnDeleteSessionByEmail(SubmittedForm: NgForm): void {
    if (SubmittedForm.valid) {
      this.DataServ.DeleteSessionByEmail(SubmittedForm.value.useremail);
      this.GetRecentData();
    }
  }

}
