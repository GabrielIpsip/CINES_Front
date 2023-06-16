import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstablishmentUpdateComponent } from './components/establishments/establishment-update/establishment-update.component';
import { EstablishmentCreateComponent } from './components/establishments/establishment-create/establishment-create.component';
import { EstablishmentSearchComponent } from './components/establishments/establishment-search/establishment-search.component';
import { HomeComponent } from './components/home/home.component';
import { EstablishmentConsultComponent } from './components/establishments/establishment-consult/establishment-consult.component';
import { SurveyCreateComponent } from './components/surveys/survey-create/survey-create.component';
import { SurveyUpdateComponent } from './components/surveys/survey-update/survey-update.component';
import { SurveyListComponent } from './components/surveys/survey-list/survey-list.component';
import { SurveyConsultComponent } from './components/surveys/survey-consult/survey-consult.component';
import { GroupConfigDataComponent } from './components/groups/group-config-data/group-config-data.component';
import { SurveyReplyComponent } from './components/surveys/survey-reply/survey-reply.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureCreateComponent } from './components/documentary-structures/documentary-structure-create/documentary-structure-create.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureConsultComponent } from './components/documentary-structures/documentary-structure-consult/documentary-structure-consult.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureUpdateComponent } from './components/documentary-structures/documentary-structure-update/documentary-structure-update.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureSearchComponent } from './components/documentary-structures/documentary-structure-search/documentary-structure-search.component';
import { PhysicalLibraryCreateComponent } from './components/physical-libraries/physical-library-create/physical-library-create.component';
import { PhysicalLibraryUpdateComponent } from './components/physical-libraries/physical-library-update/physical-library-update.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryConsultComponent } from './components/physical-libraries/physical-library-consult/physical-library-consult.component';
import { PhysicalLibrarySearchComponent } from './components/physical-libraries/physical-library-search/physical-library-search.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { UserUpdateComponent } from './components/users/user-update/user-update.component';
import { UserConsultComponent } from './components/users/user-consult/user-consult.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { RightsCheckerGuard } from './guards/rights-checker.guard';
import { RolesEnum } from './common/roles-enum.enum';
import { NotAuthorizedComponent } from './components/errors/not-authorized/not-authorized.component';
import { FirstConnectionGuard } from './guards/first-connection.guard';
import { ConfirmBeforeQuitGuard } from './guards/confirm-before-quit.guard';
import { SurveyConsultCurrentComponent } from './components/surveys/survey-consult-current/survey-consult-current.component';
// tslint:disable-next-line: max-line-length
import { SurveyConsultCurrentDocStructComponent } from './components/surveys/survey-consult-current-doc-struct/survey-consult-current-doc-struct.component';
import { DataTypesEditComponent } from './components/data-types/data-type-edit/data-type-edit.component';
import { ErrorConfirmMailComponent } from './components/errors/error-confirm-mail/error-confirm-mail.component';
import { DataSelectorComponent } from './components/broadcast/data-selector/data-selector/data-selector.component';
import { DatabaseExportComponent } from './components/broadcast/database-export/database-export/database-export.component';
import { EditorialUpdateComponent } from './components/editorials/editorial-update/editorial-update.component';
import { EditorialConsultComponent } from './components/editorials/editorial-consult/editorial-consult.component';
import { EditorialListComponent } from './components/editorials/editorial-list/editorial-list.component';
import { DataSelectorTypesComponent } from './components/broadcast/data-selector/data-selector-types/data-selector-types.component';
import { DataSelectorVisualizeComponent } from './components/broadcast/data-selector/data-selector-visualize/data-selector-visualize.component';
import { IndicatorListComponent } from './components/broadcast/indicators/indicator-list/indicator-list.component';
import { IndicatorUpdateListComponent } from './components/broadcast/indicators/indicator-update-list/indicator-update-list.component';
import { IndicatorUpdateComponent } from './components/broadcast/indicators/indicator-update/indicator-update.component';
import { IndicatorCreateComponent } from './components/broadcast/indicators/indicator-create/indicator-create.component';
import { ValidUserComponent } from './components/users/valid-user/valid-user.component';
import { ConfirmMailComponent } from './components/users/confirm-mail/confirm-mail.component';
import { FooterRouteComponent } from './components/footer/footer-route/footer-route.component';
import { FooterRouteEditorComponent } from './components/footer/footer-route-editor/footer-route-editor.component';
import { EditorialRouteComponent } from './components/editorials/editorial-route/editorial-route.component';
import { EditorialRouteEditComponent } from './components/editorials/editorial-route-edit/editorial-route-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canDeactivate: [FirstConnectionGuard]
  },

  // Footer ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'about',
    component: FooterRouteComponent
  },

  {
    path: 'cgu',
    component: FooterRouteComponent
  },

  {
    path: 'credits',
    component: FooterRouteComponent
  },

  {
    path: 'rgpd',
    component: FooterRouteComponent
  },

  {
    path: 'contact',
    component: FooterRouteComponent
  },

  {
    path: 'useful-links',
    component: FooterRouteComponent
  },

  {
    path: 'footer/edit/:name',
    component: FooterRouteEditorComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },

  // Establishments ////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'establishments/create',
    component: EstablishmentCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'establishments/search',
    component: EstablishmentSearchComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'establishments/update/:id',
    component: EstablishmentUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'establishments/:id',
    component: EstablishmentConsultComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },

  // Documentary structure /////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'documentary-structures/create',
    component: DocumentaryStructureCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'documentary-structures/search',
    component: DocumentaryStructureSearchComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'documentary-structures/update/:id',
    component: DocumentaryStructureUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'documentary-structures/:id',
    component: DocumentaryStructureConsultComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum, RolesEnum.VALID_SURVEY_RESP, RolesEnum.USER] }
  },

  // Physical libraries ////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'physical-libraries/create',
    component: PhysicalLibraryCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'physical-libraries/search',
    component: PhysicalLibrarySearchComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'physical-libraries/update/:id',
    component: PhysicalLibraryUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'physical-libraries/:id',
    component: PhysicalLibraryConsultComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },

  // Surveys ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'surveys/consult-current',
    component: SurveyConsultCurrentComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'surveys/consult-current/:id',
    component: SurveyConsultCurrentDocStructComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'surveys/list',
    component: SurveyListComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'surveys/create',
    component: SurveyCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'surveys/update/:id',
    component: SurveyUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'surveys/update/groups/:id',
    component: GroupConfigDataComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'surveys/reply/:id',
    component: SurveyReplyComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },
  {
    path: 'surveys/:id',
    component: SurveyConsultComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP] }
  },

  // Users /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  { path: 'users/valid-user', component: ValidUserComponent },
  { path: 'users/confirm-mail', component: ConfirmMailComponent },
  {
    path: 'users/list',
    component: UserListComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP, RolesEnum.USER] }
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'users/update/:id',
    component: UserUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.SURVEY_ADMIN, RolesEnum.VALID_SURVEY_RESP, RolesEnum.CURRENT_USER] }
  },
  {
    path: 'users/:id',
    component: UserConsultComponent,
    canActivate: [RightsCheckerGuard],
    data: {
      roles: [
        RolesEnum.ADMIN, RolesEnum.ADMIN_RO, RolesEnum.SURVEY_ADMIN, RolesEnum.USER, RolesEnum.VALID_SURVEY_RESP,
        RolesEnum.CURRENT_USER]
    }
  },

  // Data types ////////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'data-types/edit',
    component: DataTypesEditComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },

  // Editorials ////////////////////////////////////////////////////////////////////////////////////////////////////////

  {
    path: 'editorials/list',
    component: EditorialListComponent
  },
  {
    path: 'editorials/global',
    component: EditorialRouteComponent
  },
  {
    path: 'editorials/global/edit',
    component: EditorialRouteEditComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'editorials/:id',
    component: EditorialConsultComponent
  },
  {
    path: 'editorials/update/:id',
    component: EditorialUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },

  // Data selector /////////////////////////////////////////////////////////////////////////////////////////////////////

  { path: 'broadcast/data-selector', component: DataSelectorComponent },
  { path: 'broadcast/data-selector-types', component: DataSelectorTypesComponent },
  { path: 'broadcast/data-selector-visualize', component: DataSelectorVisualizeComponent },

  // Database export ///////////////////////////////////////////////////////////////////////////////////////////////////

  { path: 'broadcast/database-export', component: DatabaseExportComponent },

  // Indicators ////////////////////////////////////////////////////////////////////////////////////////////////////////

  { path: 'broadcast/indicators', component: IndicatorListComponent },
  { path: 'broadcast/key-figures', component: IndicatorListComponent },
  {
    path: 'indicators/list',
    component: IndicatorUpdateListComponent,
    canActivate: [RightsCheckerGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO] }
  },
  {
    path: 'indicators/create',
    component: IndicatorCreateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN] }
  },
  {
    path: 'indicators/:id',
    component: IndicatorUpdateComponent,
    canActivate: [RightsCheckerGuard],
    canDeactivate: [ConfirmBeforeQuitGuard],
    data: { roles: [RolesEnum.ADMIN, RolesEnum.ADMIN_RO] }
  },

  // Errors ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'error-confirm-mail', component: ErrorConfirmMailComponent },
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
