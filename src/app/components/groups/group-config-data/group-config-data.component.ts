import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked, OnDestroy, Input } from '@angular/core';
import { Groups } from 'src/app/models/groups.model';
import { GroupsService } from 'src/app/services/groups.service';
import { Observable, Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { SurveysService } from 'src/app/services/surveys.service';
import { Surveys } from 'src/app/models/surveys.model';
import { GroupInstructionsService } from 'src/app/services/group-instructions.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupInstructionDialogComponent } from '../group-instruction-dialog/group-instruction-dialog.component';
import { GroupInstructions } from 'src/app/models/group-instructions.model';
import { GroupCreateDialogComponent } from '../group-create-dialog/group-create-dialog.component';
import { GroupTreeComponent } from '../group-tree/group-tree.component';
import { Router, NavigationEnd } from '@angular/router';
import { DataTypeCreateDialogComponent } from '../../data-types/data-type-create-dialog/data-type-create-dialog.component';
import { GroupConfigDataListComponent } from '../group-config-data-list/group-config-data-list.component';

@Component({
  selector: 'app-group-config-data',
  templateUrl: './group-config-data.component.html',
  styleUrls: ['./group-config-data.component.scss']
})
export class GroupConfigDataComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('groupSidenav', { static: true }) groupSidenav: MatSidenav;
  @ViewChild('groupTree', { static: true }) groupTree: GroupTreeComponent;
  @ViewChild('dataTypeList', { static: true }) dataTypeList: GroupConfigDataListComponent;
  @Input() editMode = false;

  group: Observable<Groups>;
  groupValue: Groups;
  groupSub: Subscription;

  groupTitle: Observable<string>;

  survey: Surveys;
  groupInstruction: GroupInstructions;

  routerSub: Subscription;

  constructor(
    private groupsService: GroupsService,
    private cdRef: ChangeDetectorRef,
    private surveysService: SurveysService,
    private instructionService: GroupInstructionsService,
    private instructionDialog: MatDialog,
    private updateGroupDialog: MatDialog,
    private createDataTypeDialog: MatDialog,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this.group = this.groupsService.getSelectedGroup();
    this.groupTitle = this.groupsService.getSelectedGroupTitle();
    if (!this.editMode) {
      this.survey = this.surveysService.getStoredSurvey();
      this.groupSub = this.group.subscribe({
        next: (group) => this.loadGroupInstruction(group.id)
      });
    } else {
      this.groupSub = this.group.subscribe({
        next: (group) => this.groupValue = group
      });
    }
  }

  ngOnDestroy() {
    if (this.groupSub != null) {
      this.groupSub.unsubscribe();
    }
    if (this.routerSub != null) {
      this.routerSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.groupSidenav.toggle();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openGroupInstructionDialog(groupP: Groups) {
    const dialogRef = this.instructionDialog.open(GroupInstructionDialogComponent, {
      width: '50%',
      data: {
        groupInstruction: this.groupInstruction,
        group: groupP
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.groupInstruction = result;
      }
    });
  }

  openUpdateGroupDialog() {
    const dialogRef = this.updateGroupDialog.open(GroupCreateDialogComponent, {
      width: '50%',
      data: { groupList: this.groupTree.allGroupList, group: this.groupValue, nodes: this.groupTree.nodes }
    });

    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.router.navigate([this.router.url]);
        }
      }
    });
  }

  openCreateDataTypeDialog() {
    const dialogRef = this.createDataTypeDialog.open(DataTypeCreateDialogComponent, {
      width: '50%',
      data: { group: this.groupValue, groupList: this.groupTree.allGroupList, nodes: this.groupTree.nodes }
    });

    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.dataTypeList.loadDataTypeOfGroup(value.groupId);
        }
      }
    });
  }

  private loadGroupInstruction(groupId: number) {
    this.instructionService.getInstruction(groupId, this.survey.id).subscribe({
      next: (response) => this.groupInstruction = response,
      error: () => this.groupInstruction = null
    });
  }

}
