import { Surveys } from './surveys.model';

export class Editorials {
  title: string;
  content: EditorialTabContent[];
  survey: Surveys;

  constructor(editorial?: Editorials) {
    if (editorial != null) {
      this.title = editorial.title;
      this.content = JSON.parse(editorial.content.toString()) as EditorialTabContent[];
      this.survey = editorial.survey;
    } else {
      this.content = [];
    }
  }
}

export class EditorialTabContent {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}
