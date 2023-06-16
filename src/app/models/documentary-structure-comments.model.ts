export class DocumentaryStructureComments {
  surveyId: number;
  docStructId: number;
  dataTypeId: number;
  comment: string;

  constructor(surveyId: number, docStructId: number, dataTypeId: number, comment: string) {
    this.surveyId = surveyId;
    this.docStructId = docStructId;
    this.dataTypeId = dataTypeId;
    this.comment = comment;
  }
}
