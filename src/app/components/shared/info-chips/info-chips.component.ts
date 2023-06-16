import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-chips',
  templateUrl: './info-chips.component.html',
  styleUrls: ['./info-chips.component.scss']
})
export class InfoChipsComponent {

  @Input() color: string;

}
