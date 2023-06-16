import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResponse } from 'elasticsearch';
import { EsgbuApiService } from '../esgbu-api.service';
import { catchError } from 'rxjs/operators';
import { StringTools } from 'src/app/utils/string-tools';

interface BodyElasticsearchRequest {
  elasticsearchIndex: string;
  elasticsearchRequest: string;
  elasticsearchBody: any;
}

@Injectable({
  providedIn: 'root'
})
export abstract class ElasticsearchService<T> {

  private readonly NB_RESULTS_PAGE: number = 150;
  readonly MAX_SIZE: number = 10000;

  protected readonly INDEX: string;
  protected readonly COUNT = 'Count';
  protected readonly CARDINALITY  = 'Cardinality';

  private readonly baseUrl = 'elasticsearch';

  private readonly searchKey = '_search';
  private readonly mappingKey = '_mapping';

  constructor(
    private esgbuApi: EsgbuApiService<any>
  ) { }

  private addParamToBody(body: BodyElasticsearchRequest, query?: any, aggs?: any, size?: any, source?: any, from?: any)
  {

    if (query != null) {
      const queryIndex = 'query';
      body.elasticsearchBody[queryIndex] = query;
    }

    if (aggs != null) {
      const aggsIndex = 'aggs';
      body.elasticsearchBody[aggsIndex] = aggs;
    }

    if (size != null) {
      const sizeIndex = 'size';
      body.elasticsearchBody[sizeIndex] = size;
    }

    if (source != null) {
      const sourceIndex = '_source';
      body.elasticsearchBody[sourceIndex] = source;
    }

    if (from != null) {
      const fromIndex = 'from';
      body.elasticsearchBody[fromIndex] = from;
    }
  }

  protected getDocuments(query?: any, aggs?: any, size?: number, source?: any, from?: number)
  : Observable<SearchResponse<T>> {
    const body: BodyElasticsearchRequest = {
      elasticsearchIndex: this.INDEX,
      elasticsearchRequest: this.searchKey,
      elasticsearchBody: {}
    };

    if (size == null) {
      size = this.NB_RESULTS_PAGE;
    }

    this.addParamToBody(body, query, aggs, size, source, from);

    this.esgbuApi.printLog(JSON.stringify(body));
    return this.esgbuApi.post(this.baseUrl, body, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getMapping(): Observable<any> {
    const body: BodyElasticsearchRequest = {
      elasticsearchIndex: this.INDEX,
      elasticsearchRequest: this.mappingKey,
      elasticsearchBody: {}
    };
    return this.esgbuApi.post(this.baseUrl, body, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getDocumentsContent(searchResponse: SearchResponse<T>): T[] {
    return searchResponse?.hits.hits ? searchResponse.hits.hits.map(v => v._source) : [];
  }

  getCountDocumentOfResponse(searchResponse: any): number {
    return searchResponse.hits.total.value;
  }

  getCountInnerDocumentOfResponse(searchResponse: SearchResponse<T>, innerPath: string): number {
    return searchResponse.aggregations[innerPath + this.COUNT][this.COUNT].doc_count;
  }

  getCountInnerInnerDocumentOfResponse(searchResponse: SearchResponse<T>, innerPath: string): number {
    const innerPathSplit = innerPath.split('.');
    if (innerPathSplit.length !== 2) {
      return 0;
    }

    return searchResponse
      .aggregations[innerPathSplit[0] + this.COUNT][this.COUNT][innerPath + this.COUNT][this.COUNT + '2'].doc_count;
  }

  getDocumentDocumentsContentInnerHits(searchResponse: SearchResponse<any>, indexName: string, innerPath: string,
                                       keepNameSource: string[] = []): any[] {
    const results = [];
    for (const hits of searchResponse.hits.hits) {
      for (const innerDocument of hits.inner_hits[innerPath].hits.hits) {
        const document = {};
        for (const [key, value] of Object.entries(hits._source)) {
          if (keepNameSource.includes(key)) {
            document[key] = value;
          } else {
            document[indexName + StringTools.toTitleCase(key)] = value;
          }
        }
        for (const [paramName, paramValue] of Object.entries(innerDocument._source)) {
          document[paramName] = paramValue;
        }
        results.push(document);
      }
    }
    return results;
  }

  getDocumentDocumentsContentInnerInnerHits(searchResponse: SearchResponse<any>, indexName: string, innerPath: string,
                                            innerInnerPath: string, keepNameSource: string[] = []): any[] {
    const results = [];
    for (const hits of searchResponse.hits.hits) {
      for (const innerDocument of hits.inner_hits[innerPath].hits.hits) {
        for (const innerInnerDocument of innerDocument.inner_hits[innerInnerPath].hits.hits) {
          const document = {};
          for (const [key, value] of Object.entries(hits._source)) {
            if (keepNameSource.includes(key)) {
              document[key] = value;
            } else {
              document[indexName + StringTools.toTitleCase(key)] = value;
            }
          }
          for (const [key, value] of Object.entries(innerDocument._source)) {
            if (keepNameSource.includes(key)) {
              document[key] = value;
            } else {
              document[innerPath + StringTools.toTitleCase(key)] = value;
            }
          }
          for (const [paramName, paramValue] of Object.entries(innerInnerDocument._source)) {
            document[paramName] = paramValue;
          }
          results.push(document);
        }
      }
    }

    return results;
  }

  getAggregationsKey(searchResponse: SearchResponse<T>, aggregationName: string): string[] {
    if (searchResponse.aggregations != null) {
      let result = searchResponse.aggregations[aggregationName].buckets.map(v => v.key_as_string);

      if (result.length === 0 || result[0] == null) {
        result = searchResponse.aggregations[aggregationName].buckets.map(v => v.key);
      }
      return result;
    } else {
      return [];
    }
  }

}
