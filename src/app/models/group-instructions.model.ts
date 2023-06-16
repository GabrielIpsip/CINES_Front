export class GroupInstructions {
  groupId: number;
  surveyId: number;
  instruction: string;

  constructor(groupId: number, surveyId: number, instruction: string) {
    this.groupId = groupId;
    this.surveyId = surveyId;
    this.instruction = instruction;
  }
}
