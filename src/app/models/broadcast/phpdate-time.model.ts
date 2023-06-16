export class PHPDateTime {
  date: string;
  // tslint:disable-next-line: variable-name
  timezone_type: number;
  timezone: string;

  constructor(phpDateTime: PHPDateTime) {
    if (phpDateTime == null) {
      return null;
    }
    this.date = phpDateTime.date;
    this.timezone_type = phpDateTime.timezone_type;
    this.timezone = phpDateTime.timezone;
  }

  get dateWithoutHours(): string {
    if (this.date == null || this.date.length === 0) {
      return null;
    }
    const splitDate = this.date.split(' ');

    if (splitDate.length === 2) {
      return splitDate[0];
    } else {
      return null;
    }
  }
}
