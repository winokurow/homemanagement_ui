import { Pipe, PipeTransform } from '@angular/core';

import {Day} from "../../../shared/model/day";

@Pipe({
  name: 'daysSortPipe'
})
export class DaysSortPipe implements PipeTransform {

  transform(days: Day[]): Day[] {
    return days
      .sort((a, b) => {
      return a.day > b.day ? -1 : 1;
    });
  }

}
