import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FirstLetterUpperPipe'
})
export class FirstLetterUpperPipe implements PipeTransform {

  transform(value:string): string {
    let first = value.substring(0,1).toUpperCase();
    return first + value.substring(1); 
  }

}
