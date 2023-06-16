import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Groups } from 'src/app/models/groups.model';
import { GroupsService } from 'src/app/services/groups.service';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { Administrations } from 'src/app/models/administrations.model';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { GroupFlatNode } from 'src/app/common/group-flat-node';
import { GroupNode } from 'src/app/common/group-node';
import { DataValuesService } from 'src/app/services/data-values.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupCreateDialogComponent } from '../group-create-dialog/group-create-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-tree',
  templateUrl: './group-tree.component.html',
  styleUrls: ['./group-tree.component.scss']
})
export class GroupTreeComponent implements OnInit, OnDestroy {

  @Input() administration: Administrations;
  @Input() editMode = false;
  @Input() missingGroupsAnswered: number[];
  @Input() missingParentGroupsAnswered: number[];

  selectedGroup = new Groups();
  groupsArray: Groups[] = [];
  nodes: GroupNode[];
  isExpanded = false;
  isShowed = true;
  activeNode: any;
  allGroupList: Groups[];

  associatedPhysicLib: PhysicalLibraries[];

  selectedGroupSub: Subscription;

  // tslint:disable-next-line: variable-name
  private _transformer = (node: GroupNode, plevel: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      parentGroupId: node.parentGroupId,
      id: node.id,
      level: plevel,
      color: node.color,
      administrationType: node.administrationType
    };
  }

  hasChild = (_: number, node: GroupFlatNode) => node.expandable;

  // tslint:disable-next-line: member-ordering
  treeControl = new FlatTreeControl<GroupFlatNode>(
    node => node.level, node => node.expandable);
  // tslint:disable-next-line: member-ordering
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);
  // tslint:disable-next-line: member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private groupsService: GroupsService,
    private physicLibService: PhysicalLibrariesService,
    private dataValuesService: DataValuesService,
    public createGroupDialog: MatDialog
  ) { }

  ngOnInit() {
    this.groupsService.getAllGroups().subscribe({
      next: (response) => {
        this.allGroupList = response;
        response.map(val => this.groupsArray.push(Object.assign({}, val)));
        this.dataSource.data = this.buildTreeFromArray(response);
        if (this.administration && (this.administration.TYPE_NAME === AdministrationTypesEnum.DOC_STRUCT)) {
          this.addPhysicLibTrees();
        }
        if (response.length > 0) {
          const firstGroup = this.getFirstGroupGoodType(response);
          this.onChangeSelectedGroup(firstGroup);
          this.activeNode = this.treeControl.dataNodes[0];
        }
      }
    });

    this.selectedGroupSub = this.groupsService.getSelectedGroup().subscribe({
      next: (value) => {
        const newActiveNode = this.treeControl?.dataNodes?.find((el: GroupFlatNode) => el.id === value.id);
        if (newActiveNode != null) {
          this.activeNode = newActiveNode;
        }
      }
    });
  }

  ngOnDestroy() {
    this.dataValuesService.setAdministration(this.administration);
    if (this.selectedGroupSub != null) {
      this.selectedGroupSub.unsubscribe();
    }
  }

  onChangeSelectedGroup(group: Groups) {
    this.selectedGroup = group;
    this.dataValuesService.setAdministration(this.administration);
    this.groupsService.updateSelectedGroup(this.selectedGroup);
    this.groupsService.updateSelectedGroupTitle(this.groupsService.createGroupTitle(this.selectedGroup.id, this.nodes));
  }

  openCreateGroupDialog(): void {
    const dialogRef = this.createGroupDialog.open(GroupCreateDialogComponent, {
      width: '50%',
      data: { groupList: this.allGroupList, group: null, nodes: this.nodes }
    });

    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.ngOnInit();
        }
      }
    });
  }

  private getColor(group: Groups): string {
    if (this.administration != null) {
      return null;
    }
    switch (group.administrationType.name) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        return null;
      case AdministrationTypesEnum.DOC_STRUCT:
        return 'primary';
      case AdministrationTypesEnum.PHYSIC_LIB:
        return 'accent';
    }
  }

  private getFirstGroupGoodType(groups: Groups[]): Groups {
    if (this.administration == null) {
      let i = 0;
      for (const group of groups) {
        if (group.parentGroupId == null) {
          return groups[i];
        }
        i++;
      }
      return groups[0];
    }
    for (const group of groups) {
      if (group.parentGroupId == null && group.administrationType.name === this.administration.TYPE_NAME) {
        return group;
      }
    }
  }

  private buildTreeFromArray(groups: Groups[]): GroupNode[] {
    this.nodes = [];
    const roots: GroupNode[] = [];

    for (const group of groups) {

      if (this.administration != null && group.administrationType.name !== this.administration.TYPE_NAME) {
        continue;
      }

      const node = {
        title: group.title,
        parentGroupId: group.parentGroupId,
        id: group.id,
        children: [],
        color: this.getColor(group),
        administrationType: group.administrationType
      };

      const children = this.nodes[group.id]?.children;
      if (children != null) {
        node.children = children;
      }

      this.nodes[group.id] = node;


      const parentId = group.parentGroupId;
      if (!parentId) {
        roots.push(node);
        continue;
      }

      let parentNode = this.nodes[parentId];
      if (!parentNode) {
        parentNode = {
          title: '',
          id: parentId,
          parentGroupId: null,
          children: [],
          color: this.getColor(group),
          administrationType: null
        };
        this.nodes[parentId] = parentNode;
      }
      parentNode.children.push(node);
    }

    return roots;
  }

  private addPhysicLibTrees() {
    const surveyId = this.dataValuesService.getSurvey().id;
    this.physicLibService.getAllByDocStructId(this.administration.id, false, true, surveyId).subscribe({
      next: (response) => {
        this.associatedPhysicLib = response;
      }
    });
  }

}
