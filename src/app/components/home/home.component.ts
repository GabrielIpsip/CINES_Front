import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/users.model';
import { Observable } from 'rxjs';
import { SurveysService } from 'src/app/services/surveys.service';
import { Surveys } from 'src/app/models/surveys.model';
import { StatesEnum } from 'src/app/common/statesEnum.enum';
import { trigger, state, style, AUTO_STYLE, transition, animate } from '@angular/animations';
import { EditorialsService } from 'src/app/services/editorials.service';
import { Editorials } from 'src/app/models/editorials.model';
import { RoutesService } from 'src/app/services/routes.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  currentUser: Observable<Users>;

  lastOpenSurvey: Surveys;
  lastPublishedSurvey: Surveys;

  lastEditorial: Editorials;
  globalEditorial: string;
  globalEditorialSummaryText = '';
  nbParagrah = 0;

  collapsed = true;

  isLoadedPublicSurvey = false;
  isLoadedSurvey = false;

  constructor(
    private usersService: UsersService,
    private surveysService: SurveysService,
    private editorialsService: EditorialsService,
    private routesService: RoutesService,
    private translate: TranslateService
  ) { }

  get globalEditorialSummary() {
    if (this.globalEditorialSummaryText.length > 0) {
      return this.globalEditorialSummaryText;
    }

    const parser = new DOMParser();
    const html = parser.parseFromString(this.globalEditorial, 'text/html');
    return html.body.textContent.substr(0, 200) + '...';
  }

  ngOnInit() {
    this.currentUser = this.usersService.getCurrentUser();

    this.currentUser.subscribe({
      next: (response) => {
        if (response != null && response.id !== 1 && !this.isLoadedSurvey) {
          this.isLoadedSurvey = true;
          this.loadSurvey(false);
        }
        else if (!this.isLoadedSurvey && !this.isLoadedPublicSurvey) {
          this.isLoadedPublicSurvey = true;
          this.loadSurvey(true);
        }
      }
    });
  }

  toggleDetail() {
    this.collapsed = !this.collapsed;
  }

  private loadSurvey(publicAPI: boolean) {
    this.surveysService.getAllSurvey(publicAPI).subscribe({
      next: (response) => {
        if (response.length > 0) {

          if (publicAPI) {
            this.loadGlobalEditorial();

            for (const survey of response) {
              if (survey.state.name === StatesEnum.published) {
                this.lastPublishedSurvey = survey;
                this.loadEditorial(survey.id);
                return;
              }
            }
          } else {
            for (const survey of response) {
              if (survey.state.name === StatesEnum.open) {
                this.lastOpenSurvey = survey;
                return;
              }
            }
          }
        }
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  private loadEditorial(surveyId: number) {
    this.editorialsService.getEditorial(surveyId).subscribe({
      next: (response) => this.lastEditorial = new Editorials(response),
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  private loadGlobalEditorial() {
    this.routesService.getRouteByName(this.routesService.editorialRouteName, this.translate.getDefaultLang())
      .subscribe({
        next: (response) => {
          this.globalEditorial = JSON.parse(response.content)[0].content;
        }
      });
  }

}
