import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstablishmentUpdateComponent } from './components/establishments/establishment-update/establishment-update.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { EstablishmentViewComponent } from './components/establishments/establishment-view/establishment-view.component';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { EstablishmentCreateComponent } from './components/establishments/establishment-create/establishment-create.component';
import { EstablishmentSearchComponent } from './components/establishments/establishment-search/establishment-search.component';
import { EstablishmentSearchBarComponent } from './components/establishments/establishment-search-bar/establishment-search-bar.component';
// tslint:disable-next-line: max-line-length
import { EstablishmentSearchListComponent } from './components/establishments/establishment-search-list/establishment-search-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './components/home/home.component';
import { EstablishmentRelationComponent } from './components/establishments/establishment-relation/establishment-relation.component';
// tslint:disable-next-line: max-line-length
import { EstablishmentRelationDialogComponent } from './components/establishments/establishment-relation-dialog/establishment-relation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { EstablishmentRelationSearchListComponent } from './components/establishments/establishment-relation-search-list/establishment-relation-search-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { EstablishmentConsultComponent } from './components/establishments/establishment-consult/establishment-consult.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SurveyViewComponent } from './components/surveys/survey-view/survey-view.component';
import { SurveyCreateComponent } from './components/surveys/survey-create/survey-create.component';
import { SurveyUpdateComponent } from './components/surveys/survey-update/survey-update.component';
import { SurveyListComponent } from './components/surveys/survey-list/survey-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { SurveyConsultComponent } from './components/surveys/survey-consult/survey-consult.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GroupConfigDataComponent } from './components/groups/group-config-data/group-config-data.component';
import { MatTreeModule } from '@angular/material/tree';
import { GroupConfigDataListComponent } from './components/groups/group-config-data-list/group-config-data-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GroupTreeComponent } from './components/groups/group-tree/group-tree.component';
import { SurveyReplyButtonComponent } from './components/surveys/survey-reply-button/survey-reply-button.component';
import { DateTools } from './utils/date-tools';
import { SurveyReplyComponent } from './components/surveys/survey-reply/survey-reply.component';
import { SurveyReplyDataListComponent } from './components/surveys/survey-reply-data-list/survey-reply-data-list.component';
import { DataTypeFormComponent } from './components/data-types/data-type-form/data-type-form.component';
import { DataTypeNumberFormComponent } from './components/data-types/data-type-number-form/data-type-number-form.component';
import { DataTypeTextFormComponent } from './components/data-types/data-type-text-form/data-type-text-form.component';
import { DataTypeOperationFormComponent } from './components/data-types/data-type-operation-form/data-type-operation-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DataTypeBooleanFormComponent } from './components/data-types/data-type-boolean-form/data-type-boolean-form.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LogginComponent } from './components/users/loggin/loggin.component';
import { MatMenuModule } from '@angular/material/menu';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureViewComponent } from './components/documentary-structures/documentary-structure-view/documentary-structure-view.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureCreateComponent } from './components/documentary-structures/documentary-structure-create/documentary-structure-create.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureConsultComponent } from './components/documentary-structures/documentary-structure-consult/documentary-structure-consult.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureUpdateComponent } from './components/documentary-structures/documentary-structure-update/documentary-structure-update.component';
import { ReturnButtonComponent } from './components/shared/return-button/return-button.component';
import { InfoChipsComponent } from './components/shared/info-chips/info-chips.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureSearchComponent } from './components/documentary-structures/documentary-structure-search/documentary-structure-search.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureSearchBarComponent } from './components/documentary-structures/documentary-structure-search-bar/documentary-structure-search-bar.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureSearchListComponent } from './components/documentary-structures/documentary-structure-search-list/documentary-structure-search-list.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureEstablishmentSearchDialogComponent } from './components/documentary-structures/documentary-structure-establishment-search-dialog/documentary-structure-establishment-search-dialog.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureEstablishmentSearchListComponent } from './components/documentary-structures/documentary-structure-establishment-search-list/documentary-structure-establishment-search-list.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureRelationComponent } from './components/documentary-structures/documentary-structure-relation/documentary-structure-relation.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureRelationDialogComponent } from './components/documentary-structures/documentary-structure-relation-dialog/documentary-structure-relation-dialog.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureRelationSearchListComponent } from './components/documentary-structures/documentary-structure-relation-search-list/documentary-structure-relation-search-list.component';
import { PhysicalLibraryViewComponent } from './components/physical-libraries/physical-library-view/physical-library-view.component';
import { PhysicalLibraryCreateComponent } from './components/physical-libraries/physical-library-create/physical-library-create.component';
import { PhysicalLibraryUpdateComponent } from './components/physical-libraries/physical-library-update/physical-library-update.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryConsultComponent } from './components/physical-libraries/physical-library-consult/physical-library-consult.component';
import { PhysicalLibrarySearchComponent } from './components/physical-libraries/physical-library-search/physical-library-search.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibrarySearchBarComponent } from './components/physical-libraries/physical-library-search-bar/physical-library-search-bar.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibrarySearchListComponent } from './components/physical-libraries/physical-library-search-list/physical-library-search-list.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryDocStructSearchDialogComponent } from './components/physical-libraries/physical-library-doc-struct-search-dialog/physical-library-doc-struct-search-dialog.component';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryDocStructSearchListComponent } from './components/physical-libraries/physical-library-doc-struct-search-list/physical-library-doc-struct-search-list.component';
import { MatTabsModule } from '@angular/material/tabs';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructurePhysicLibListComponent } from './components/documentary-structures/documentary-structure-physic-lib-list/documentary-structure-physic-lib-list.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserViewComponent } from './components/users/user-view/user-view.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { UserUpdateComponent } from './components/users/user-update/user-update.component';
import { UserConsultComponent } from './components/users/user-consult/user-consult.component';
import { UserRoleListComponent } from './components/users/user-role-list/user-role-list.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
// tslint:disable-next-line: max-line-length
import { EstablishmentDocStructListComponent } from './components/establishments/establishment-doc-struct-list/establishment-doc-struct-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpErrorInterceptor } from './interceptors/httpError.interceptor';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { NotAuthorizedComponent } from './components/errors/not-authorized/not-authorized.component';
import { UserRoleRequestsComponent } from './components/users/user-role-requests/user-role-requests.component';
import { FirstConnectionComponent } from './components/users/first-connection/first-connection.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FirstConnectionGuard } from './guards/first-connection.guard';
import { ConfirmBeforeQuitGuard } from './guards/confirm-before-quit.guard';
import { GroupSubgroupPhysicLibComponent } from './components/groups/group-subgroup-physic-lib/group-subgroup-physic-lib.component';
import { FooterBarComponent } from './components/footer/footer-bar/footer-bar.component';
import { SurveyConsultCurrentComponent } from './components/surveys/survey-consult-current/survey-consult-current.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// tslint:disable-next-line: max-line-length
import { SurveyConsultCurrentDocStructComponent } from './components/surveys/survey-consult-current-doc-struct/survey-consult-current-doc-struct.component';
import { EnvironmentService } from './services/environment.service';
import { GroupInstructionDialogComponent } from './components/groups/group-instruction-dialog/group-instruction-dialog.component';
import { DataTypesEditComponent } from './components/data-types/data-type-edit/data-type-edit.component';
import { GroupCreateDialogComponent } from './components/groups/group-create-dialog/group-create-dialog.component';
import { GroupViewComponent } from './components/groups/group-view/group-view.component';
import { ExportAdministrationMenuComponent } from './components/shared/export-administration-menu/export-administration-menu.component';
import { DataTypeCreateDialogComponent } from './components/data-types/data-type-create-dialog/data-type-create-dialog.component';
import { DataTypeViewComponent } from './components/data-types/data-type-view/data-type-view.component';
import { DataTypeTextViewComponent } from './components/data-types/data-type-text-view/data-type-text-view.component';
import { DataTypeNumberViewComponent } from './components/data-types/data-type-number-view/data-type-number-view.component';
import { DataTypeOperationViewComponent } from './components/data-types/data-type-operation-view/data-type-operation-view.component';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureCommentComponent } from './components/documentary-structures/documentary-structure-comment/documentary-structure-comment.component';
import { ErrorConfirmMailComponent } from './components/errors/error-confirm-mail/error-confirm-mail.component';
// tslint:disable-next-line: max-line-length
import { SendConfirmationMailButtonComponent } from './components/users/send-confirmation-mail-button/send-confirmation-mail-button.component';
import { UserNotValidComponent } from './components/users/user-not-valid/user-not-valid.component';
import { DatabaseExportRunButtonComponent } from './components/broadcast/database-export/database-export-run-button/database-export-run-button.component';
import { DatabaseExportSelectorComponent } from './components/broadcast/database-export/database-export-selector/database-export-selector.component';
import { BroadcastMainMenuComponent } from './components/broadcast/broadcast-main-menu/broadcast-main-menu.component';
import { DataSelectorComponent } from './components/broadcast/data-selector/data-selector/data-selector.component';
import { DatabaseExportComponent } from './components/broadcast/database-export/database-export/database-export.component';
import { DataSelectorDataTypeComponent } from './components/broadcast/data-selector/data-selector-data-type/data-selector-data-type.component';
import { DataSelectorDataTypeNumberComponent } from './components/broadcast/data-selector/data-selector-data-type-number/data-selector-data-type-number.component';
import { DataSelectorDocStructSearchListComponent } from './components/broadcast/data-selector/data-selector-doc-struct-search-list/data-selector-doc-struct-search-list.component';
import { EditorialConsultComponent } from './components/editorials/editorial-consult/editorial-consult.component';
import { EditorialUpdateComponent } from './components/editorials/editorial-update/editorial-update.component';
import { EditorialListComponent } from './components/editorials/editorial-list/editorial-list.component';
import { EditorialFileListComponent } from './components/editorials/editorial-file-list/editorial-file-list.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DataSelectorTypesComponent } from './components/broadcast/data-selector/data-selector-types/data-selector-types.component';
import { DataSelectorTypesTreeComponent } from './components/broadcast/data-selector/data-selector-types-tree/data-selector-types-tree.component';
import { DataSelectorVisualizeComponent } from './components/broadcast/data-selector/data-selector-visualize/data-selector-visualize.component';
import { DataSelectorVisualizeTableComponent } from './components/broadcast/data-selector/data-selector-visualize-table/data-selector-visualize-table.component';
import { DataSelectorExportTableComponent } from './components/broadcast/data-selector/data-selector-export-table/data-selector-export-table.component';
import { NoSanitizePipe } from './pipes/no-sanitize.pipe';
import { DataSelectorBasketButtonComponent } from './components/broadcast/data-selector/data-selector-basket-button/data-selector-basket-button.component';
import { DataSelectorBasketDialogComponent } from './components/broadcast/data-selector/data-selector-basket-dialog/data-selector-basket-dialog.component';
import { DataSelectorBasketListComponent } from './components/broadcast/data-selector/data-selector-basket-list/data-selector-basket-list.component';
import { ChartsSelectorComponent } from './components/broadcast/data-selector/charts/charts-selector/charts-selector.component';
import { ChartsYearSelectorComponent } from './components/broadcast/data-selector/charts/charts-year-selector/charts-year-selector.component';
import { ChartsAdministrationSelectorComponent } from './components/broadcast/data-selector/charts/charts-administration-selector/charts-administration-selector.component';
import { ChartsVariableSelectorComponent } from './components/broadcast/data-selector/charts/charts-variable-selector/charts-variable-selector.component';
import { ChartsVisualizationComponent } from './components/broadcast/data-selector/charts/charts-visualization/charts-visualization.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataSelectorInstitutionSearchListComponent } from './components/broadcast/data-selector/data-selector-institution-search-list/data-selector-institution-search-list.component';
import { DataSelectorPhysicLibSearchListComponent } from './components/broadcast/data-selector/data-selector-physic-lib-search-list/data-selector-physic-lib-search-list.component';
import { DataSelectorSearchListComponent } from './components/broadcast/data-selector/data-selector-search-list/data-selector-search-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { AdministrationActiveHistoryComponent } from './components/shared/administration-active-history/administration-active-history.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocumentaryStructureLinkHistoryComponent } from './components/documentary-structures/documentary-structure-link-history/documentary-structure-link-history.component';
import { PhysicalLibraryLinkHistoryComponent } from './components/physical-libraries/physical-library-link-history/physical-library-link-history.component';
import { DataSelectorSimpleDataTypeComponent } from './components/broadcast/data-selector/data-selector-simple-data-type/data-selector-simple-data-type.component';
import { DataSelectorDataTypeTextComponent } from './components/broadcast/data-selector/data-selector-data-type-text/data-selector-data-type-text.component';
import { AgGridModule } from 'ag-grid-angular';
import { DataSelectorTableTooltipComponent } from './components/broadcast/data-selector/data-selector-table-tooltip/data-selector-table-tooltip.component';
import { IndicatorListComponent } from './components/broadcast/indicators/indicator-list/indicator-list.component';
import { DatabaseExportActiveSurveyComponent } from './components/broadcast/database-export/database-export-active-survey/database-export-active-survey.component';
import { IndicatorCardChartComponent } from './components/broadcast/indicators/indicator-card-chart/indicator-card-chart.component';
import { IndicatorEstablishmentListComponent } from './components/broadcast/indicators/indicator-establishment-list/indicator-establishment-list.component';
import { IndicatorGlobalListComponent } from './components/broadcast/indicators/indicator-global-list/indicator-global-list.component';
import { IndicatorDocStructListComponent } from './components/broadcast/indicators/indicator-doc-struct-list/indicator-doc-struct-list.component';
import { IndicatorRegionListComponent } from './components/broadcast/indicators/indicator-region-list/indicator-region-list.component';
import { IndicatorUpdateListComponent } from './components/broadcast/indicators/indicator-update-list/indicator-update-list.component';
import { IndicatorUpdateComponent } from './components/broadcast/indicators/indicator-update/indicator-update.component';
import { IndicatorViewComponent } from './components/broadcast/indicators/indicator-view/indicator-view.component';
import { IndicatorCreateComponent } from './components/broadcast/indicators/indicator-create/indicator-create.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { ConfirmMailComponent } from './components/users/confirm-mail/confirm-mail.component';
import { ValidUserComponent } from './components/users/valid-user/valid-user.component';
import { DocumentaryStructureUserListComponent } from './components/documentary-structures/documentary-structure-user-list/documentary-structure-user-list.component';
import { IndicatorExportComponent } from './components/broadcast/indicators/indicator-export/indicator-export.component';
import { FooterRouteComponent } from './components/footer/footer-route/footer-route.component';
import { FooterRouteEditorComponent } from './components/footer/footer-route-editor/footer-route-editor.component';
import { EditorialRouteComponent } from './components/editorials/editorial-route/editorial-route.component';
import { EditorialRouteEditorComponent } from './components/editorials/editorial-route-editor/editorial-route-editor.component';
import { RoutesFilesListComponent } from './components/shared/routes-files-list/routes-files-list.component';
import { EditorialRouteEditComponent } from './components/editorials/editorial-route-edit/editorial-route-edit.component';
import { SurveyReplyProgressStatusComponent } from './components/surveys/survey-reply-progress-status/survey-reply-progress-status.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        AppComponent,
        DateTools,
        EstablishmentUpdateComponent,
        MainMenuComponent,
        EstablishmentViewComponent,
        EstablishmentCreateComponent,
        EstablishmentSearchComponent,
        EstablishmentSearchBarComponent,
        EstablishmentSearchListComponent,
        HomeComponent,
        EstablishmentRelationComponent,
        EstablishmentRelationDialogComponent,
        EstablishmentRelationSearchListComponent,
        EstablishmentConsultComponent,
        SurveyViewComponent,
        SurveyCreateComponent,
        SurveyUpdateComponent,
        SurveyListComponent,
        SurveyConsultComponent,
        GroupConfigDataComponent,
        GroupConfigDataListComponent,
        GroupTreeComponent,
        SurveyReplyButtonComponent,
        SurveyReplyComponent,
        SurveyReplyDataListComponent,
        DataTypeFormComponent,
        DataTypeNumberFormComponent,
        DataTypeTextFormComponent,
        DataTypeOperationFormComponent,
        DataTypeBooleanFormComponent,
        LogginComponent,
        LoaderComponent,
        DocumentaryStructureViewComponent,
        DocumentaryStructureCreateComponent,
        DocumentaryStructureConsultComponent,
        DocumentaryStructureUpdateComponent,
        ReturnButtonComponent,
        InfoChipsComponent,
        DocumentaryStructureSearchComponent,
        DocumentaryStructureSearchBarComponent,
        DocumentaryStructureSearchListComponent,
        DocumentaryStructureEstablishmentSearchDialogComponent,
        DocumentaryStructureEstablishmentSearchListComponent,
        DocumentaryStructureRelationComponent,
        DocumentaryStructureRelationDialogComponent,
        DocumentaryStructureRelationSearchListComponent,
        PhysicalLibraryViewComponent,
        PhysicalLibraryCreateComponent,
        PhysicalLibraryUpdateComponent,
        PhysicalLibraryConsultComponent,
        PhysicalLibrarySearchComponent,
        PhysicalLibrarySearchBarComponent,
        PhysicalLibrarySearchListComponent,
        PhysicalLibraryDocStructSearchDialogComponent,
        PhysicalLibraryDocStructSearchListComponent,
        DocumentaryStructurePhysicLibListComponent,
        UserListComponent,
        UserViewComponent,
        UserCreateComponent,
        UserUpdateComponent,
        UserConsultComponent,
        UserRoleListComponent,
        ConfirmDialogComponent,
        EstablishmentDocStructListComponent,
        NotFoundComponent,
        NotAuthorizedComponent,
        UserRoleRequestsComponent,
        FirstConnectionComponent,
        GroupSubgroupPhysicLibComponent,
        FooterBarComponent,
        SurveyConsultCurrentComponent,
        SurveyConsultCurrentDocStructComponent,
        GroupInstructionDialogComponent,
        DataTypesEditComponent,
        GroupCreateDialogComponent,
        GroupViewComponent,
        ExportAdministrationMenuComponent,
        DataTypeCreateDialogComponent,
        DataTypeViewComponent,
        DataTypeTextViewComponent,
        DataTypeNumberViewComponent,
        DataTypeOperationViewComponent,
        DocumentaryStructureCommentComponent,
        ErrorConfirmMailComponent,
        SendConfirmationMailButtonComponent,
        UserNotValidComponent,
        DatabaseExportRunButtonComponent,
        DatabaseExportSelectorComponent,
        BroadcastMainMenuComponent,
        DataSelectorComponent,
        DataSelectorInstitutionSearchListComponent,
        DatabaseExportComponent,
        DataSelectorDataTypeComponent,
        DataSelectorDataTypeNumberComponent,
        DataSelectorSearchListComponent,
        DataSelectorDocStructSearchListComponent,
        DataSelectorPhysicLibSearchListComponent,
        EditorialConsultComponent,
        EditorialUpdateComponent,
        EditorialListComponent,
        EditorialFileListComponent,
        DataSelectorTypesComponent,
        DataSelectorTypesTreeComponent,
        DataSelectorVisualizeComponent,
        DataSelectorVisualizeTableComponent,
        DataSelectorExportTableComponent,
        NoSanitizePipe,
        DataSelectorBasketButtonComponent,
        DataSelectorBasketDialogComponent,
        DataSelectorBasketListComponent,
        ChartsSelectorComponent,
        ChartsYearSelectorComponent,
        ChartsAdministrationSelectorComponent,
        ChartsVariableSelectorComponent,
        ChartsVisualizationComponent,
        AdministrationActiveHistoryComponent,
        DocumentaryStructureLinkHistoryComponent,
        PhysicalLibraryLinkHistoryComponent,
        DataSelectorSimpleDataTypeComponent,
        DataSelectorDataTypeTextComponent,
        DataSelectorTableTooltipComponent,
        IndicatorListComponent,
        DatabaseExportActiveSurveyComponent,
        IndicatorCardChartComponent,
        IndicatorEstablishmentListComponent,
        IndicatorGlobalListComponent,
        IndicatorDocStructListComponent,
        IndicatorRegionListComponent,
        IndicatorUpdateListComponent,
        IndicatorUpdateComponent,
        IndicatorViewComponent,
        IndicatorCreateComponent,
        ConfirmMailComponent,
        ValidUserComponent,
        DocumentaryStructureUserListComponent,
        IndicatorExportComponent,
        FooterRouteComponent,
        FooterRouteEditorComponent,
        EditorialRouteComponent,
        EditorialRouteEditorComponent,
        RoutesFilesListComponent,
        EditorialRouteEditComponent,
        SurveyReplyProgressStatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatGridListModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        MatExpansionModule,
        MatSidenavModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatToolbarModule,
        MatTreeModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatMenuModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatProgressBarModule,
        MatBadgeModule,
        MatSlideToggleModule,
        ClipboardModule,
        AngularEditorModule,
        NgxChartsModule,
        AgGridModule.withComponents([DataSelectorTableTooltipComponent]),
        NgJsonEditorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        LoaderService,
        FirstConnectionGuard,
        ConfirmBeforeQuitGuard,
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        DatePipe,
        { provide: MAT_DATE_LOCALE, useValue: 'fr' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [EnvironmentService],
            useFactory: (envService: EnvironmentService) => {
                return () => {
                    return envService.loadEnvironment();
                };
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
