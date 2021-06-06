import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from '../../../shared/shared.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { User } from '../users.model';
import { UsersService } from '../users.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private PageChanged!: Subscription;
  private FetchOnInint!: Subscription;
  private DataLoading!: Subscription;

  usCurrentPage!: number;
  usPageSize!: number;
  usCollectionSize!: number;
  IsLoading!: boolean;

  ShowMessage!: boolean;
  MessageType!: string;
  Message!: string;
  RecivedErrorSub!: Subscription;

  Users!: User[];

  constructor(
    private ActiveRoute: ActivatedRoute,
    private DataServ: DataStorageService,
    public AdminServ: UsersService,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.PageChanged.unsubscribe();
    this.DataLoading.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {
    this.usPageSize = environment.AdminUserListPageSize;

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
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
