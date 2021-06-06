import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';

import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { MediaListComponent } from './media/media-list/media-list.component';
import { MediaEditComponent } from './media/media-edit/media-edit.component';

import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';
import { SessionsEditComponent } from './sessions/sessions-edit/sessions-edit.component';

import { AdminRoutingModule } from './admin-routing.module';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AdminComponent,
    UserEditComponent,
    UserListComponent,
    MediaListComponent,
    SessionsListComponent,
    SessionsEditComponent,
    MediaEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbPaginationModule,
    AdminRoutingModule,
    MatSlideToggleModule
  ]
})
export class AdminModule { }
