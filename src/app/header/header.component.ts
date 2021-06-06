import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  LoggedIn = false;
  SecondFactor = false;

  UserEmail: string;
  UserAdmin: boolean;

  private LoginSub: Subscription;
  private SecondFactorSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.LoggedIn = this.auth.CheckRegistered();
    this.UserEmail = this.auth.GetUserEmail();
    this.UserAdmin = this.auth.CheckIfUserIsAdmin();
    if (!this.auth.HaveToCheckSecondFactor()) {
      this.SecondFactor = true;
    }

    this.LoginSub = this.auth.AuthResultSub.subscribe((loggedin) => {
      this.LoggedIn = loggedin;
      if (!this.auth.HaveToCheckSecondFactor()) {
        this.SecondFactor = true;
      }
      this.UserEmail = this.auth.GetUserEmail();
      this.UserAdmin = this.auth.CheckIfUserIsAdmin();
    });

    this.SecondFactorSub = this.auth.SfResultSub.subscribe((result) => {
      this.SecondFactor = result;
    });

  }

  SearchRecipes(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.router.navigate(['recipes'], { queryParams: { search: encodeURI(fvalue.searchreq) } });
    }
  }

  ngOnDestroy(): void {
    this.LoginSub.unsubscribe();
    this.SecondFactorSub.unsubscribe();
  }

  OnLogout() {
    this.LoggedIn = false;
    this.UserEmail = '';
    this.UserAdmin = false;
    this.auth.SignOut();
  }
}
