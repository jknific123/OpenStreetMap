import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custumPipe'
})
export class RatingPipe implements PipeTransform {

  transform(value: number): any {
    // implement pipe logic here

    // if (value === -999) {
    //   return '-';
    // } else {
    //   return value;
    // }
    return value;
  }

}
