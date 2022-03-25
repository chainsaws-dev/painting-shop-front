import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileComponent } from './user-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SecureImagePipe } from '../shared/secure-image-pipe.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FirstLetterUpperPipe } from '../shared/first-letter-upper.pipe';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: UserProfileComponent, },
];

@NgModule({
  declarations: [
    UserProfileComponent,
    SecureImagePipe,    
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
    RouterModule.forChild(routes),
    NgbTooltipModule
  ]
})
export class UserProfileModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}