import { States } from './states.model';

export class Surveys {
  id: number;
  name: string;
  calendarYear: string;
  dataCalendarYear: string;
  creation: string;
  start: string;
  end: string;
  instruction: string;
  state: States;

  constructor(survey?: Surveys) {
    if (survey == null) {
      this.state = new States();
    } else {
      this.id = survey.id;
      this.name = survey.name;
      this.calendarYear = survey.calendarYear;
      this.dataCalendarYear = survey.dataCalendarYear;
      this.creation = survey.creation;
      this.start = survey.start;
      this.end = survey.end;
      this.instruction = survey.instruction;
      this.state = survey.state;
    }
  }

  equals(survey: Surveys) {

    return this.name === survey.name &&
      this.calendarYear === survey.calendarYear &&
      this.dataCalendarYear === survey.dataCalendarYear &&
      this.creation === survey.creation &&
      this.start.slice(0, 10) === survey.start.slice(0, 10) &&
      this.end.slice(0, 10) === survey.end.slice(0, 10) &&
      this.instruction === survey.instruction &&
      this.state.id === survey.state.id;
  }

}


