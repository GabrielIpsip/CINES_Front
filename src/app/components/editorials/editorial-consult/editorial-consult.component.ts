import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Editorials } from 'src/app/models/editorials.model';
import { EditorialsService } from 'src/app/services/editorials.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-editorial-consult',
  templateUrl: './editorial-consult.component.html',
  styleUrls: ['./editorial-consult.component.scss']
})
export class EditorialConsultComponent implements OnInit {

  @Input() surveyId: number;

  editorial: Editorials;
  DiCoDocMode = false;

  hasEditorial = true;

  constructor(
    private editorialsService: EditorialsService,
    private activatedRoute: ActivatedRoute,
    private rightsCheckerService: RightsCheckerService
  ) { }

  ngOnInit() {
    if (this.surveyId == null) {
      this.surveyId = +this.activatedRoute.snapshot.params.id;
    }
    this.DiCoDocMode = this.rightsCheckerService.isADMIN();

    this.editorialsService.getEditorial(this.surveyId).subscribe({
      next: (response) => {
        this.editorial = new Editorials(response);
      },
      error: (error) => {
        if (error.status === 404) {
          this.hasEditorial = false;
        }
      }
    });
  }

}
