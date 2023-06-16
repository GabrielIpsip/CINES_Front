import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subscription } from 'rxjs';
import { Groups } from 'src/app/models/groups.model';
import { GroupsService } from 'src/app/services/groups.service';
import { DataValuesService } from 'src/app/services/data-values.service';
import { Administrations } from 'src/app/models/administrations.model';
import { GroupInstructionsService } from 'src/app/services/group-instructions.service';
import { DataValues } from 'src/app/models/data-values.model';

@Component({
  selector: 'app-survey-reply',
  templateUrl: './survey-reply.component.html',
  styleUrls: ['./survey-reply.component.scss']
})
export class SurveyReplyComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  @ViewChild('groupSidenav', { static: true }) groupSidenav: MatSidenav;

  group: Observable<Groups>;
  groupTitle: Observable<string>;
  groupSub: Subscription;
  groupInstruction: string;

  administration: Administrations;
  administrationUseName: string;
  administrationLink: string;

  missingDataValues: number[];
  missingGroups: number[];
  missingParentGroups: number[];

  constructor(
    private groupsService: GroupsService,
    private dataValuesService: DataValuesService,
    private cdRef: ChangeDetectorRef,
    private groupInstructionService: GroupInstructionsService
  ) { }

  ngOnInit() {
    this.group = this.groupsService.getSelectedGroup();
    this.groupTitle = this.groupsService.getSelectedGroupTitle();
    this.groupSub = this.group.subscribe({
      next: (value) => this.updateGroupInstruction(value),
      error: () => this.groupInstruction = null
    });

    this.administration = this.dataValuesService.getAdministration();
    if (this.administration != null) {
      this.administrationUseName = this.administration.useName;
      this.administrationLink = '/' + this.administration.KEBAB_CASE_NAME_PLURAL + '/' + this.administration.id;
    }
  }

  ngAfterViewInit() {
    this.groupSidenav.toggle();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }

  onChangeMissingDataValues(dataTypes: number[]) {
    this.missingDataValues = dataTypes;
  }

  onChangeMissingGroups(groups: number[]) {
    this.missingGroups = groups;
  }

  onChangeMissingParentGroups(parentGroups: number[]) {
    this.missingParentGroups = parentGroups;
  }

  updateGroupInstruction(group: Groups) {
    const surveyId = this.dataValuesService.getSurvey().id;
    if (group != null && group.id != null) {
      this.groupInstructionService.getInstruction(group.id, surveyId).subscribe({
        next: (response) => this.groupInstruction = response.instruction,
        error: () => {
          this.groupInstruction = null;
        }
      });
    }
  }

}
