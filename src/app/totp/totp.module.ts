import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TotpComponent } from './totp.component';

const routes: Routes = [
  { path: '', component: TotpComponent }
];

@NgModule({
  declarations: [TotpComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbAlertModule,
    NgbTooltipModule
  ]
})
export class TotpModule { }
