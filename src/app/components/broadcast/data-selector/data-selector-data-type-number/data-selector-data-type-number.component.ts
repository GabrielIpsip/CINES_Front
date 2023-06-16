import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataTypes } from 'src/app/models/data-types.model';
import { BroadcastInstitutionsService } from 'src/app/services/broadcast/broadcast-institutions.service';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { CommonDataSelector } from '../common-data-selector';

@Component({
  selector: 'app-data-selector-data-type-number',
  templateUrl: './data-selector-data-type-number.component.html',
  styleUrls: ['./data-selector-data-type-number.component.scss']
})
export class DataSelectorDataTypeNumberComponent implements OnInit {

  @Input() searchFields: FormGroup;
  @Input() controlName: string;
  @Input() administrationType: AdministrationTypesEnum;
  @Input() dataSelector: CommonDataSelector;
  @Input() dataType: DataTypes;
  @Input() appearance: string;

  min: number;
  max: number;

  quart1: number;
  quart2: number;
  quart3: number;
  quart4: number;

  constructor(
    private institutionService: BroadcastInstitutionsService,
    private translate: TranslateService,
    private dataSelectorService: DataSelectorService
  ) { }

  get locale(): string {
    return this.translate.getDefaultLang();
  }

  get unitSymbol(): string {
    const unit = this.dataType.measureUnit;
    if (unit.length < 3) {
      return unit;
    }
  }

  ngOnInit(): void {
    const percentilesSaved = this.dataSelectorService.numberPercentiles.get(this.dataType.code);

    if (percentilesSaved != null) {
      this.min = percentilesSaved[0];
      this.quart1 = percentilesSaved[1];
      this.quart2 = percentilesSaved[2];
      this.quart3 = percentilesSaved[3];
      this.quart4 = percentilesSaved[4];
      this.max = percentilesSaved[5];
    } else {
      this.initPercentilesFromDatabase();
    }
  }

  private initPercentilesFromDatabase() {
    this.institutionService.getPercentiles(this.dataType.code, this.administrationType).subscribe({
      next: (response) => {
        const percentiles = this.institutionService.getValuesFromPercentile(response, this.administrationType);
        this.min = Math.floor(percentiles['0.0']);
        this.quart1 = Math.round(percentiles['20.0']);
        this.quart2 = Math.round(percentiles['40.0']);
        this.quart3 = Math.round(percentiles['60.0']);
        this.quart4 = Math.round(percentiles['80.0']);
        this.max = Math.ceil(percentiles['100.0']);

        this.dataSelectorService.numberPercentiles.set(
          this.dataType.code,
          [this.min, this.quart1, this.quart2, this.quart3, this.quart4, this.max]);
      }
    });
  }

}
