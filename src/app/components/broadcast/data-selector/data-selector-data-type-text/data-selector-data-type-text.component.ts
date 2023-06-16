import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataTypes } from 'src/app/models/data-types.model';
import { Texts } from 'src/app/models/texts.model';
import { StringTools } from 'src/app/utils/string-tools';

@Component({
  selector: 'app-data-selector-data-type-text',
  templateUrl: './data-selector-data-type-text.component.html',
  styleUrls: ['./data-selector-data-type-text.component.scss']
})
export class DataSelectorDataTypeTextComponent implements OnInit {

  @Input() controlName: string;
  @Input() dataType: DataTypes;
  @Input() searchFields: FormGroup;
  @Input() appearance: string;

  isSelected = false;
  options: string[];

  constructor() { }

  ngOnInit() {
    const constraint: Texts = this.dataType.constraint as Texts;
    if (constraint != null && constraint.regex != null) {
      this.options = StringTools.getOptionValueFromRegexSelectWord(constraint.regex);
      if (this.options != null && this.options.length > 0) {
        this.options = this.options.filter((el) => el.trim() !== '');
        this.isSelected = this.options.length > 0;
      }
    }
  }

}
