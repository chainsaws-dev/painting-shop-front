import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ErrorResponse } from '../shared/shared.model';

@Component({
  selector: 'app-totp',
  templateUrl: './totp.component.html',
  styleUrls: ['./totp.component.css']
})
export class TotpComponent implements OnInit, OnDestroy {

  LoginMode = true;
  IsLoading = false;

  private SfErrSub!: Subscription;
  private SfResultSub!: Subscription;

  Message!: string;
  ShowMessage!: boolean;
  MessageType!: string;

  constructor(
    private authservice: AuthService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.SfResultSub.unsubscribe();
    this.SfErrSub.unsubscribe();
  }

  ngOnInit(): void {
    if (this.authservice.CheckRegistered()) {
      this.Redirect();
    }

    this.SfErrSub = this.authservice.SfErrorSub.subscribe((response: ErrorResponse) => {
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

      this.IsLoading = false;
    });

    this.SfResultSub = this.authservice.SfResultSub.subscribe((Success: boolean) => {
      this.IsLoading = false;
      if (Success) {
        this.Redirect();
      }
    });
  }


  OnSubmitForm(SignupForm: NgForm) {

    this.IsLoading = true;

    this.authservice.SecondFactorCheck(SignupForm.value.passkey);

    SignupForm.reset();

  }

  Redirect() {
    this.router.navigate(['/recipes']);
  }


}
