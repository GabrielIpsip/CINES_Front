import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { TypesEnum } from 'src/app/common/typesEnum.enum';

/**
 * Node for to-do item
 */
export class DataTypeNode {
  id: number;
  children?: DataTypeNode[];
  name: string;
  code: string;
  type?: TypesEnum;
  measureUnit?: string;
  decimal?: boolean;
}

/** Flat to-do item node with expandable and level information */
export class DataTypeFlatNode {
  id: number;
  name: string;
  level: number;
  expandable: boolean;
  code: string | null;
  type: TypesEnum | null;
  measureUnit: string;
  decimal: boolean;
}

@Component({
  selector: 'app-data-selector-types-tree',
  templateUrl: './data-selector-types-tree.component.html',
  styleUrls: ['./data-selector-types-tree.component.scss']
})
export class DataSelectorTypesTreeComponent implements OnInit {

  @Input() data: DataTypeNode[];
  @Input() title: string;
  @Input() alreadySelectedDataType: DataTypeFlatNode[];
  @Input() administrationType: AdministrationTypesEnum;

  isAllExpanded = false;
  isAllSelected = false;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DataTypeFlatNode, DataTypeNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DataTypeNode, DataTypeFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: DataTypeFlatNode | null = null;

  treeControl: FlatTreeControl<DataTypeFlatNode>;

  treeFlattener: MatTreeFlattener<DataTypeNode, DataTypeFlatNode>;

  dataSource: MatTreeFlatDataSource<DataTypeNode, DataTypeFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<DataTypeFlatNode>(true /* multiple */);

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DataTypeFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    const generalInfoNode: DataTypeNode = {
      id: null,
      name: this.translate.instant('broadcast.generalInfo'),
      code: null,
      children: [],
      decimal: null
    };
    this.addCommonChildrenNode(generalInfoNode);

    switch (this.administrationType) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        this.addEstablishmentNode(generalInfoNode);
        break;
      case AdministrationTypesEnum.DOC_STRUCT:
        this.addDocStructNode(generalInfoNode);
        break;
      case AdministrationTypesEnum.PHYSIC_LIB:
        this.addPhysicLibNode(generalInfoNode);
        break;
    }

    this.dataSource.data = [generalInfoNode].concat(this.data);
    this.initAlreadySelectedNodeFromCache();
  }

  getLevel = (node: DataTypeFlatNode) => node.level;

  isExpandable = (node: DataTypeFlatNode) => node.expandable;

  getChildren = (node: DataTypeNode): DataTypeNode[] => node.children;

  hasChild = (_: number, _nodeData: DataTypeFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DataTypeFlatNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DataTypeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new DataTypeFlatNode();
    flatNode.name = node.name;
    flatNode.measureUnit = node.measureUnit;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.code = node.code;
    flatNode.id = node.id;
    flatNode.type = node.type;
    flatNode.decimal = node.decimal;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: DataTypeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: DataTypeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: DataTypeFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: DataTypeFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: DataTypeFlatNode): void {
    let parent: DataTypeFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DataTypeFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: DataTypeFlatNode): DataTypeFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  toggleAllNode() {
    if (!this.isAllExpanded) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
    this.isAllExpanded = !this.isAllExpanded;
  }

  selectAllNode() {
    if (!this.isAllSelected) {
      for (const node of this.treeControl.dataNodes) {
        this.checklistSelection.select(node);
      }
    } else {
      for (const node of this.treeControl.dataNodes) {
        this.checklistSelection.deselect(node);
      }
    }
    this.isAllSelected = !this.isAllSelected;
  }

  onClickNode(node: DataTypeFlatNode) {
    if (this.checklistSelection.isSelected(node)) {
      this.isAllSelected = false;
    }
  }

  getSelection(): DataTypeFlatNode[] {
    const selectedNodes: DataTypeFlatNode[] = [];
    for (const node of this.treeControl.dataNodes) {
      if (this.checklistSelection.isSelected(node) && node.code != null) {
        selectedNodes.push(node);
      }
    }
    return selectedNodes;
  }

  private initAlreadySelectedNodeFromCache() {
    for (const dataType of this.alreadySelectedDataType) {
      for (const node of this.treeControl.dataNodes) {
        if (dataType.code === node.code) {
          this.checklistSelection.select(node);
          this.checkAllParentsSelection(node);
        }
      }
    }
  }

  addCommonChildrenNode(rootNode: DataTypeNode) {
    rootNode.children.push(
      { id: 0, name: this.translate.instant('establishment.view.id'), code: 'id', type: TypesEnum.number },
      {
        id: 0, name: this.translate.instant('establishment.view.officialName'), code: 'officialName',
        type: TypesEnum.text
      },
      {
        id: 0, name: this.translate.instant('establishment.view.address'), code: 'address',
        type: TypesEnum.text
      },
      { id: 0, name: this.translate.instant('establishment.view.city'), code: 'city', type: TypesEnum.text },
      {
        id: 0, name: this.translate.instant('establishment.view.postalCode'), code: 'postalCode',
        type: TypesEnum.text
      },
      {
        id: 0, name: this.translate.instant('establishment.view.department'), code: 'department',
        type: TypesEnum.text
      },
      { id: 0, name: this.translate.instant('establishment.view.region'), code: 'region', type: TypesEnum.text }
    );
  }

  addEstablishmentNode(rootNode: DataTypeNode) {
    rootNode.children.push(
      { id: 0, name: this.translate.instant('establishment.view.acronym'), code: 'acronym', type: TypesEnum.text },
      { id: 0, name: this.translate.instant('establishment.view.brand'), code: 'brand', type: TypesEnum.text },
      { id: 0, name: this.translate.instant('establishment.view.website'), code: 'website', type: TypesEnum.text },
      { id: 0, name: this.translate.instant('establishment.view.type'), code: 'type', type: TypesEnum.text },
    );
  }

  addDocStructNode(rootNode: DataTypeNode) {
    rootNode.children.push(
      { id: 0, name: this.translate.instant('docStruct.view.acronym'), code: 'acronym', type: TypesEnum.text },
      { id: 0, name: this.translate.instant('docStruct.view.website'), code: 'website', type: TypesEnum.text },
      {
        id: 0, name: this.translate.instant('broadcast.institutionsId'), code: 'institutionsId',
        type: TypesEnum.number
      },
      {
        id: 0, name: this.translate.instant('broadcast.institutionsUseName'), code: 'institutionsUseName',
        type: TypesEnum.text
      },
    );
  }

  addPhysicLibNode(rootNode: DataTypeNode) {
    rootNode.children.push(
      { id: 0, name: this.translate.instant('physicLib.view.sortOrder'), code: 'sortOrder', type: TypesEnum.number },
      { id: 0, name: this.translate.instant('physicLib.view.fictitious'), code: 'fictitious', type: TypesEnum.boolean },
      {
        id: 0, name: this.translate.instant('broadcast.institutionsId'), code: 'institutionsId',
        type: TypesEnum.number
      },
      {
        id: 0, name: this.translate.instant('broadcast.institutionsUseName'), code: 'institutionsUseName',
        type: TypesEnum.text
      },
      {
        id: 0, name: this.translate.instant('broadcast.documentaryStructuresId'), code: 'documentaryStructuresId',
        type: TypesEnum.number
      },
      {
        id: 0, name: this.translate.instant('broadcast.documentaryStructuresUseName'),
        code: 'documentaryStructuresUseName', type: TypesEnum.text
      },
    );
  }
}
