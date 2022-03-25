import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstLetterUpperPipe } from './first-letter-upper.pipe';


@NgModule({
  declarations: [
    FirstLetterUpperPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    FirstLetterUpperPipe,
  ]
})
export class SharedModule { }
