import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TotpComponent } from './totp.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FirstLetterUpperPipe } from '../shared/first-letter-upper.pipe';

const routes: Routes = [
  { path: '', component: TotpComponent }
];

@NgModule({
  declarations: [
    TotpComponent,    
  ],
  imports: [     
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    NgbAlertModule,
    NgbTooltipModule
  ]
})
export class TotpModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}