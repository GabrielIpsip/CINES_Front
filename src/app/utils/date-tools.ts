import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'datetools' })
export class DateTools implements PipeTransform {

  constructor(
    private datePipe: DatePipe
  ) { }

  strToDate(str: string): Date {

    if (!str) {
      return null;
    }

    let strSplitted = str.split(' ');
    if (strSplitted.length === 3) {
      return new Date(strSplitted[0]);
    }

    strSplitted = str.split('T');
    if (strSplitted.length === 2) {
      return new Date(strSplitted[0]);
    }

    return new Date(str);
  }

  strToYear(str: string): string {
    if (!str) {
      return null;
    }

    const date = this.strToDate(str);
    return this.datePipe.transform(date, 'yyyy');
  }

  transform(value: string, ...args: any[]) {
    if (args.length <= 0) {
      return value;
    }

    if (args[0] === 'yyyy') {
      return this.strToYear(value);
    } else if (args[0] === 'date') {
      return this.strToDate(value);
    } else {
      return value;
    }
  }
}
