import { Component, Input, OnChanges } from '@angular/core';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { DocumentaryStructureCommentsService } from 'src/app/services/documentary-structure-comments.service';
import { DocumentaryStructureComments } from 'src/app/models/documentary-structure-comments.model';
import { RolesEnum } from 'src/app/common/roles-enum.enum';
import { FormGroup, Validators, FormControl } from '@angular/forms';

class FormParam {
  comment: DocumentaryStructureComments;
  editMode: boolean;
}

@Component({
  selector: 'app-documentary-structure-comment',
  templateUrl: './documentary-structure-comment.component.html',
  styleUrls: ['./documentary-structure-comment.component.scss']
})
export class DocumentaryStructureCommentComponent implements OnChanges {

  @Input() loadComment: boolean;

  @Input() surveyId: number;
  @Input() dataTypeId: number;
  @Input() docStructId: number[];
  @Input() docStructName: Map<number, string>;

  docStructIdToShow: number[] = [];

  formParams = new Map<number, FormParam>();

  loaded = false;

  commentFormGroup = new FormGroup({});

  roleAuthorizedEdit: string[] =
    [RolesEnum.ADMIN, RolesEnum.USER, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP];

  constructor(
    private userRolesService: UserRolesService,
    private docStructCommentsService: DocumentaryStructureCommentsService
  ) { }

  ngOnChanges() {
    if (this.loadComment && !this.loaded) {
      this.initDocStructIdToShow();
      this.initForm();
      this.initComment();
      this.loaded = true;
    }
  }

  private initDocStructIdToShow() {
    const userRoles = this.userRolesService.getCurrentUserRole();
    let docStructEdit = [];
    this.docStructIdToShow = this.docStructId;

    for (const userRole of userRoles) {
      const roleName = userRole.role.name;

      if (roleName === RolesEnum.ADMIN) {
        docStructEdit = this.docStructId;
        break;
      }

      if (userRole.role.associated && this.docStructId.indexOf(userRole.documentaryStructure.id) > -1) {
        if (this.roleAuthorizedEdit.indexOf(roleName) > -1) {
          docStructEdit.push(userRole.documentaryStructure.id);
        }
      }
    }

    for (const docStructId of this.docStructId) {
      const formParam = new FormParam();
      formParam.editMode = docStructEdit.indexOf(docStructId) > -1;
      this.formParams.set(docStructId, formParam);
    }
  }

  private initForm() {
    for (const docStructId of this.docStructIdToShow) {
      const formParam = this.formParams.get(docStructId);
      const formControl = new FormControl('', [Validators.maxLength(65535)]);
      if (formParam.comment != null) {
        formControl.setValue(formParam.comment.comment);
      }
      if (!formParam.editMode) {
        formControl.disable();
      }
      this.commentFormGroup.addControl(docStructId.toString(), formControl);
    }
  }

  onUpdateComment(docStructId: number) {
    const commentInfo = this.formParams.get(docStructId);
    const commentValue = this.commentFormGroup.get(docStructId.toString()).value;

    if (commentValue == null) {
      return;
    }

    if (commentInfo.comment == null || commentInfo.comment.surveyId !== this.surveyId) {
      this.docStructCommentsService.createComment(this.surveyId, this.dataTypeId, docStructId, commentValue).subscribe({
        next: (response) => commentInfo.comment = response
      });
    } else if (commentValue !== commentInfo.comment.comment) {
      this.docStructCommentsService.updateComment(this.surveyId, this.dataTypeId, docStructId, commentValue).subscribe({
        next: (response) => commentInfo.comment = response
      });
    }
  }

  private initComment() {
    this.docStructCommentsService.getComments(this.surveyId, this.dataTypeId, this.docStructIdToShow, true).subscribe({
      next: (response) => {
        for (const comment of response) {
          this.formParams.get(comment.docStructId).comment = comment;
          this.commentFormGroup.get(comment.docStructId.toString()).setValue(comment.comment);
        }
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

}
