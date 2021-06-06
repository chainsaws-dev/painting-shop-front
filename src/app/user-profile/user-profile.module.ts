import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileComponent } from './user-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SecureImagePipe } from '../shared/secure-image-pipe.pipe';

const routes: Routes = [
  { path: '', component: UserProfileComponent, },
];

@NgModule({
  declarations: [
    UserProfileComponent,
    SecureImagePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    RouterModule.forChild(routes),
    NgbTooltipModule
  ]
})
export class UserProfileModule { }
