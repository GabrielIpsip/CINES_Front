import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../services/users.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private usersService: UsersService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((error) => {

        const errorMessage: string = (typeof error.error === 'string') ? error.error : '';
        const errorCode: number = error.status;
        const errorUrl: string = error.url;

        switch (errorCode) {

          case 500:
            this.errorPopup('error.500');
            return [];


          case 403:
            if (errorUrl.endsWith(this.usersService.authentSuccessUrl)) {
              break;
            }

            if (errorUrl.match('.+\/users\/[0-9]+') != null && request.method !== 'DELETE') {
              break;
            }

            if (errorMessage.startsWith('This survey is validate.')) {
              this.errorPopup('error.surveyValidated');
              return [];
            }

            this.errorPopup('error.notAuthorized');
            return [];

          case 409:
            if (errorMessage.startsWith('Group busy.')) {
              this.errorPopup('error.groupBusy');
              return [];
            }

        }

        return throwError(error);
      }));
  }

  errorPopup(codeStr: string) {
    this.translate.stream(codeStr).subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }
}
