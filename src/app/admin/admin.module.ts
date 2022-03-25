import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';

import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { MediaListComponent } from './media/media-list/media-list.component';
import { MediaEditComponent } from './media/media-edit/media-edit.component';

import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';
import { SessionsEditComponent } from './sessions/sessions-edit/sessions-edit.component';

import { AdminRoutingModule } from './admin-routing.module';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    UserEditComponent,
    UserListComponent,
    MediaListComponent,
    SessionsListComponent,
    SessionsEditComponent,
    MediaEditComponent,
    
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    NgbAlertModule,
    NgbPaginationModule,
    NgbTooltipModule,
    AdminRoutingModule,
    MatSlideToggleModule
  ]
})
export class AdminModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}
