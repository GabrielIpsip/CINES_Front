import { Component, Inject, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Groups } from 'src/app/models/groups.model';
import { GroupViewComponent } from '../group-view/group-view.component';
import { GroupsService } from 'src/app/services/groups.service';
import { GroupNode } from 'src/app/common/group-node';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-create-dialog',
  templateUrl: './group-create-dialog.component.html',
  styleUrls: ['./group-create-dialog.component.scss']
})
export class GroupCreateDialogComponent implements AfterViewChecked {

  @ViewChild(GroupViewComponent)
  groupView: GroupViewComponent;

  constructor(
    public dialogRef: MatDialogRef<GroupCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupList: Groups[], group: Groups, nodes: GroupNode[] },
    private groupsService: GroupsService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onApplyClick() {
    const bodyGroup = this.groupView.getNewValues();
    if (this.data.group == null) {
      this.groupsService.createGroup(bodyGroup).subscribe({
        next: (response) => this.dialogRef.close(response)
      });
    } else {
      this.groupsService.updateGroup(this.data.group.id, bodyGroup).subscribe({
        next: (response) => this.dialogRef.close(response),
        error: (error) => {
          if (error.error === 'Can\'t create cyclic relation.') {
            this.errorPopup('error.cyclicRelation');
          }
        }
      });
    }
  }

  private errorPopup(codeTranslation: string) {
    this.translate.stream(codeTranslation).subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
