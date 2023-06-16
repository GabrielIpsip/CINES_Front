import { Component, OnInit, Input } from '@angular/core';
import { Groups } from 'src/app/models/groups.model';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { GroupsService } from 'src/app/services/groups.service';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { GroupNode } from 'src/app/common/group-node';
import { GroupFlatNode } from 'src/app/common/group-flat-node';
import { DataValuesService } from 'src/app/services/data-values.service';

@Component({
  selector: 'app-group-subgroup-physic-lib',
  templateUrl: './group-subgroup-physic-lib.component.html',
  styleUrls: ['./group-subgroup-physic-lib.component.scss']
})
export class GroupSubgroupPhysicLibComponent implements OnInit {

  @Input() physicLib: PhysicalLibraries;
  @Input() allGroupList: Groups[];
  @Input() missingGroupsAnswered: number[];
  @Input() missingParentGroupsAnswered: number[];

  selectedGroup = new Groups();
  groupsArray: Groups[] = [];
  nodes: GroupNode[];
  isExpanded = false;
  isShowed = false;
  activeNode: any;

  // tslint:disable-next-line: variable-name
  private _transformer = (node: GroupNode, plevel: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      parentGroupId: node.parentGroupId,
      id: node.id,
      level: plevel
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
    private dataValuesService: DataValuesService
  ) { }

  ngOnInit() {
    if (this.allGroupList != null) {
      this.allGroupList.map(val => this.groupsArray.push(Object.assign({}, val)));
      this.dataSource.data = this.buildTreeFromArray(this.allGroupList);
    } else {
      this.groupsService.getAllGroups().subscribe(response => {
        response.map(val => this.groupsArray.push(Object.assign({}, val)));
        this.dataSource.data = this.buildTreeFromArray(response);
      });
    }
  }

  onChangeSelectedGroup(group: Groups) {
    this.selectedGroup = group;
    this.dataValuesService.setAdministrationWithoutSave(new PhysicalLibraries(this.physicLib));
    this.groupsService.updateSelectedGroup(this.selectedGroup);
    this.groupsService.updateSelectedGroupTitle(this.createGroupTitle(this.selectedGroup.id));
  }

  private createGroupTitle(groupId: number): string {
    const node = this.nodes[groupId];
    if (node == null) {
      return '';
    } else if (node.title == null) {
      return '';
    } else if (node.parentGroupId == null) {
      return node.title;
    } else {
      return this.createGroupTitle(node.parentGroupId) + ' > ' + node.title;
    }
  }

  private buildTreeFromArray(groups: Groups[]): GroupNode[] {
    this.nodes = [];
    const roots: GroupNode[] = [];

    for (const group of groups) {

      if (group.administrationType.name !== AdministrationTypesEnum.PHYSIC_LIB) {
        continue;
      }

      let node = this.nodes[group.id];
      if (node) {
        node.title = group.title;
      } else {
        node = { title: group.title, parentGroupId: group.parentGroupId, id: group.id, children: [] };
        this.nodes[group.id] = node;
      }

      const parentId = group.parentGroupId;
      if (!parentId) {
        roots.push(node);
        continue;
      }

      let parentNode = this.nodes[parentId];
      if (!parentNode) {
        parentNode = { title: '', id: parentId, parentGroupId: null, children: [] };
        this.nodes[parentId] = parentNode;
      }
      parentNode.children.push(node);
    }

    return roots;
  }

}
