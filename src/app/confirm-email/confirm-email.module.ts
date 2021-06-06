import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ConfirmEmailComponent} from './confirm-email.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', component: ConfirmEmailComponent, },
];

@NgModule({
  declarations: [
    ConfirmEmailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    RouterModule.forChild(routes),
    NgbTooltipModule
  ]
})
export class ConfirmEmailModule { }
