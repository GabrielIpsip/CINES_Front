import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-button',
  templateUrl: './return-button.component.html',
  styleUrls: ['./return-button.component.scss']
})
export class ReturnButtonComponent {

  @Input() locationBack: string;
  @Input() raised = false;

  constructor(
    private location: Location,
    private router: Router
  ) { }

  return() {
    if (this.locationBack) {
      this.router.navigateByUrl(this.locationBack);
    } else {
      this.location.back();
    }
  }

}
