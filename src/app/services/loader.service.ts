import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoadingSubj = new Subject<boolean>();
  isLoading = this.isLoadingSubj.asObservable();

  private force = false;

  show(force = false) {
    if (force) {
      this.force = true;
    }
    this.isLoadingSubj.next(true);
  }

  hide(force = false) {
    if (this.force) {
      if (force) {
        this.isLoadingSubj.next(false);
        this.force = false;
      }
    } else {
      this.isLoadingSubj.next(false);
    }
  }

}
