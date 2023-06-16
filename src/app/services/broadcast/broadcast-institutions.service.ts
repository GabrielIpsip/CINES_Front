import { Injectable } from '@angular/core';
import { SearchResponse } from 'elasticsearch';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastTypeEnum } from 'src/app/common/broadcast/broadcast-type-enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { BroadcastDataType } from 'src/app/models/broadcast/broadcast-data-type.model';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { ElasticsearchService } from './elasticsearch.service';

@Injectable({
  providedIn: 'root'
})
export class BroadcastInstitutionsService extends ElasticsearchService<BroadcastInstitution> {

  protected readonly INDEX = 'esgbu_institutions';

  public readonly BASE_NAME = 'institutions';
  public readonly DOC_STRUCT_PATH = 'documentaryStructures';
  public readonly PHYSIC_LIB_PATH = this.DOC_STRUCT_PATH + '.' + 'physicalLibraries';

  readonly YEARS_AGGS_NAME = 'years';
  readonly TYPES_AGGS_NAME = 'types';

  getAllYears() {
    const aggs = {
      [this.YEARS_AGGS_NAME]: {
        terms: {
          field: 'year',
        }
      }
    };

    return this.getDocuments(null, aggs, 0);
  }

  getAllEstablishmentType() {
    const aggs = {
      [this.TYPES_AGGS_NAME]: {
        terms: {
          field: 'type',
        }
      }
    };

    return this.getDocuments(null, aggs, 0);
  }

  getPercentiles(fieldName: string, administrationType: AdministrationTypesEnum) {

    let path: string;

    if (administrationType === AdministrationTypesEnum.DOC_STRUCT) {
      fieldName = this.DOC_STRUCT_PATH + '.' + fieldName;
      path = this.DOC_STRUCT_PATH;
    } else if (administrationType === AdministrationTypesEnum.PHYSIC_LIB) {
      fieldName = this.PHYSIC_LIB_PATH + '.' + fieldName;
      path = this.PHYSIC_LIB_PATH;
    }

    const commonAggs = {
      quart: {
        percentiles: {
          field: fieldName,
          percents: [
            0, 20, 40, 60, 80, 100
          ]
        }
      }
    };

    let resultAggs: any;
    if (administrationType === AdministrationTypesEnum.ESTABLISHMENT) {
      resultAggs = commonAggs;
    } else {
      resultAggs = {
        [administrationType]: {
          nested: {
            path
          },
          aggs: commonAggs
        }
      };
    }

    return this.getDocuments(null, resultAggs, 0);
  }

  getValuesFromPercentile(searchResponse: SearchResponse<BroadcastInstitution>,
                          administrationType: AdministrationTypesEnum) {
    if (administrationType === AdministrationTypesEnum.ESTABLISHMENT) {
      return searchResponse.aggregations.quart.values;
    } else {
      return searchResponse.aggregations[administrationType].quart.values;
    }
  }

  getAllInstitution(query?: any, size?: number, from?: number) {
    const aggs = {
      [this.CARDINALITY]: {
        cardinality: {
          field: 'id'
        }
      }
    };

    return this.getDocuments(query, aggs, size, null, from);
  }

  getNumberUniqueInstitution(searchResponse: SearchResponse<BroadcastInstitution>): number {
    return searchResponse.aggregations[this.CARDINALITY].value;
  }

  getAllNestedAdministration(query: any, innerPath: string, size?: number, from?: number) {
    const source = ['year', 'id', 'useName'];
    let innerQueryFilter;
    let innerInnerQueryFilter;

    const innerPathSplit = innerPath.split('.');
    let firstInnerPath = innerPath;

    if (innerPathSplit.length === 2) {
      firstInnerPath = innerPathSplit[0];
    }

    for (const el of query.bool.must) {
      if (el.nested && el.nested.path === firstInnerPath) {
        innerQueryFilter = el.nested.query.bool;

        if (innerPathSplit.length === 2) {
          for (const innerEl of innerQueryFilter.must) {
            if (innerEl.nested && innerEl.nested.path === innerPath) {
              innerInnerQueryFilter = innerEl.nested.query.bool;
            }
          }
        }
      }
    }

    const aggs: any = {
      [firstInnerPath + this.COUNT]: {
        nested: {
          path: firstInnerPath
        },
        aggs: {
          [this.COUNT]: {
            filter: {
              bool: innerQueryFilter
            }
          }
        }
      }
    };

    if (innerPathSplit.length === 2) {
      aggs[firstInnerPath + this.COUNT].aggs[this.COUNT].aggs =
      {
        [innerPath + this.COUNT]: {
          nested: {
            path: innerPath
          },
          aggs: {
            [this.COUNT + '2']: {
              filter: {
                bool: innerInnerQueryFilter
              },
              aggs: {
                [this.CARDINALITY]: {
                  cardinality: {
                    field: this.PHYSIC_LIB_PATH + '.id'
                  }
                }
              }
            }
          }
        }
      };
    } else {
      aggs[firstInnerPath + this.COUNT].aggs[this.COUNT].aggs = {
        [this.CARDINALITY]: {
          cardinality: {
            field: this.DOC_STRUCT_PATH + '.id'
          }
        }
      };
    }

    return this.getDocuments(query, aggs, size, source, from);
  }

  getNumberUniqueDocStruct(searchResponse: SearchResponse<BroadcastInstitution>): number {
    return searchResponse.aggregations[this.DOC_STRUCT_PATH + this.COUNT][this.COUNT][this.CARDINALITY].value;
  }

  getNumberUniquePhysicLib(searchResponse: SearchResponse<BroadcastInstitution>): number {
    return searchResponse.aggregations[this.DOC_STRUCT_PATH + this.COUNT][this.COUNT][this.PHYSIC_LIB_PATH + this.COUNT]
    [this.COUNT + '2'][this.CARDINALITY].value;
  }

  getEstablishmentMapping(mappingResponse: any): Map<string, BroadcastDataType> {
    const mapping = mappingResponse.mappings.properties;
    return this.getDataTypeFromMapping(mapping, new BroadcastInstitution());
  }

  getDocStructMapping(mappingResponse: any): Map<string, BroadcastDataType> {
    const mapping = mappingResponse.mappings.properties.documentaryStructures.properties;
    return this.getDataTypeFromMapping(mapping, new BroadcastDocumentaryStructure());
  }

  getPhysicLibMapping(mappingResponse: any): Map<string, BroadcastDataType> {
    const mapping = mappingResponse.mappings.properties
      .documentaryStructures.properties
      .physicalLibraries.properties;
    return this.getDataTypeFromMapping(mapping, new BroadcastPhysicalLibrary());
  }

  private getDataTypeFromMapping(mapping: any, administration: BroadcastAdministration): Map<string, BroadcastDataType> {

    const noDataType = Object.keys(administration);
    const dataTypes: [string, any][] = Object.entries(mapping);
    const result = new Map();

    for (const dataType of dataTypes) {
      const code = dataType[0];
      const type = dataType[1].type;
      const name = dataType[1].meta?.name;
      const measureUnit = dataType[1].meta?.measureUnit;

      const broadcastDataType = new BroadcastDataType(type, name, measureUnit, code);

      if (type !== BroadcastTypeEnum.nested && !noDataType.includes(code)) {
        result.set(code, broadcastDataType);
      }
    }

    return result;
  }

}
