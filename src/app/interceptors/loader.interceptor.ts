import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export const skipLoaderHeader = 'X-Skip-Loader';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    public loaderService: LoaderService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has(skipLoaderHeader)) {
      const headers = req.headers.delete(skipLoaderHeader);
      return next.handle(req.clone({ headers }));
    }

    this.loaderService.show();
    return next.handle(req).pipe(
      finalize(() => this.loaderService.hide())
    );
  }
}
