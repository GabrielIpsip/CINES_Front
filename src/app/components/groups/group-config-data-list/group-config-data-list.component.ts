import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { DataTypesService } from 'src/app/services/data-types.service';
import { Groups } from 'src/app/models/groups.model';
import { Observable, Subscription } from 'rxjs';
import { GroupsService } from 'src/app/services/groups.service';
import { SurveyDataTypesService } from 'src/app/services/survey-data-types.service';
import { SurveyDataTypes } from 'src/app/models/survey-data-types.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SurveysService } from 'src/app/services/surveys.service';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { MatDialog } from '@angular/material/dialog';
import { DataTypeCreateDialogComponent } from '../../data-types/data-type-create-dialog/data-type-create-dialog.component';
import { GroupNode } from 'src/app/common/group-node';

@Component({
  selector: 'app-group-config-data-list',
  templateUrl: './group-config-data-list.component.html',
  styleUrls: ['./group-config-data-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupConfigDataListComponent implements OnInit, OnDestroy {

  @Input() editMode = false;
  @Input() nodes: GroupNode[];
  @Input() groupList: Groups[];

  group: Observable<Groups>;
  groupValue: Groups;
  private groupSub: Subscription;

  columnsToDisplay = ['info', 'code', 'name', 'measureUnit', 'date'];
  expandedElement: DataTypes | null;
  dataTypes: DataTypes[];
  existingRelation: SurveyDataTypes[];
  relations: boolean[];
  surveyId: number;

  routerSub: Subscription;

  constructor(
    private dataTypesService: DataTypesService,
    private groupsService: GroupsService,
    private surveyDataTypesService: SurveyDataTypesService,
    private activatedRoute: ActivatedRoute,
    private surveysService: SurveysService,
    private esgbuService: ESGBUService,
    private updateDataTypeDialog: MatDialog,
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
    this.surveyId = this.activatedRoute.snapshot.params.id;
    this.relations = [];
    if (!this.editMode) {
      this.columnsToDisplay.push('active');
      this.initTitle();
      this.surveyDataTypesService.getAllBySurveyId(this.surveyId).subscribe({
        next: (response) => this.initialize(response),
        error: () => this.initialize(null)
      });
    } else {
      this.columnsToDisplay.push('edit');
      this.initialize(null);
    }
  }

  initTitle() {
    const survey = this.surveysService.getStoredSurvey();
    if (survey != null) {
      this.esgbuService.setTitle(survey.name);
    }
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
    this.esgbuService.clearTitle();
    this.routerSub.unsubscribe();
  }

  initialize(relation: SurveyDataTypes[]) {
    this.existingRelation = (relation) ? relation : [];
    this.buildRelationArrayFromRelations(this.existingRelation);
    this.group = this.groupsService.getSelectedGroup();
    this.groupSub = this.group.subscribe(value => {
      if (value.id) {
        this.groupValue = value;
        this.loadDataTypeOfGroup(value.id);
      }
    });
  }

  loadDataTypeOfGroup(groupId: number) {
    this.dataTypesService.getAllDataTypesByGroup(groupId).subscribe({
      next: (response) => {
        this.dataTypes = response;
        this.buildRelationArrayFromTypes(this.dataTypes);
      },
      error: () => this.dataTypes = []
    });
  }

  onUpdateDataActiveValue(dataType: DataTypes) {
    this.surveyDataTypesService.updateRelation(this.surveyId, dataType.id, !this.relations[dataType.id]).subscribe({
      next: (response) => {
        this.relations[response.dataTypeId] = response.active;
      },
      error: () => {
        this.surveyDataTypesService.createRelation(this.surveyId, dataType.id, this.relations[dataType.id])
          .subscribe({
            next: (response) => this.relations[response.dataTypeId] = response.active
          });
      }
    });
  }

  createNewRelation(surveyId: number, dataTypeId: number, active: boolean) {
    this.surveyDataTypesService.createRelation(surveyId, dataTypeId, active).subscribe();
  }

  openUpdateDataTypeDialog(groupP: Groups, dataType: DataTypes): void {
    const dialogRef = this.updateDataTypeDialog.open(DataTypeCreateDialogComponent, {
      width: '75%',
      data: { group: groupP, dataType, nodes: this.nodes, groupList: this.groupList }
    });

    dialogRef.afterClosed().subscribe({
      next: (value: DataTypes) => {
        if (value) {
          if (value.groupId === this.groupValue.id) {
            this.loadDataTypeOfGroup(value.groupId);
          } else {
            const newGroup = this.groupList.find((el: Groups) => el.id === value.groupId);
            if (newGroup != null) {
              this.groupsService.updateSelectedGroup(newGroup);
              this.groupsService.updateSelectedGroupTitle(
                this.groupsService.createGroupTitle(value.groupId, this.nodes));
            }
          }
        }
      }
    });
  }

  private buildRelationArrayFromTypes(types: DataTypes[]) {
    for (const type of types) {
      if (this.relations[type.id] === undefined) {
        this.relations[type.id] = false;
      }
    }
  }

  private buildRelationArrayFromRelations(relations: SurveyDataTypes[]) {
    for (const relation of relations) {
      this.relations[relation.dataTypeId] = relation.active;
    }
  }

}
