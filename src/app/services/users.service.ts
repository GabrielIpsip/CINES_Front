import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Users } from '../models/users.model';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

class BodyUser {
  eppn: string;
  mail: string;
  phone: string;
  firstname: string;
  lastname: string;
  active: boolean;

  constructor(user: Users) {
    this.eppn = user.eppn;
    this.mail = user.mail;
    this.phone = user.phone;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.active = user.active;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly baseUrl = 'users';
  public readonly authentSuccessUrl = this.baseUrl + '/authent-success';

  private currentUserSubject = new BehaviorSubject<Users>(null);
  private currentUserObs = this.currentUserSubject.asObservable();

  constructor(
    private esgbuApi: EsgbuApiService<Users>,
  ) { }

  getUser(id: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllUsers() {
    return this.esgbuApi.getAll(this.baseUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createUser(user: Users) {
    const body = new BodyUser(user);
    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateUser(user: Users, id: number) {
    const body = new BodyUser(user);
    return this.esgbuApi.put(this.baseUrl + '/' + id, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  deleteUser(id: number) {
    return this.esgbuApi.delete(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  sendConfirmationMail() {
    return this.esgbuApi.get(this.baseUrl + '/' + 'send-confirmation-mail')
      .pipe(catchError(this.esgbuApi.handleError));
  }

  initializeCurrentUser() {
    this.getAPIConnectedUser().subscribe({
      next: (response) => {
        EsgbuApiService.setCsrfToken(response.csrfToken?.value);
        if (environment.devMode && environment.testUser != null) {
          this.currentUserSubject.next(environment.testUser);
        } else {
          this.currentUserSubject.next(response);
        }
      },
      error: () => this.currentUserSubject.next(null)
    });
  }

  login(redirectUrl: string = '') {
    this.getAPIConnectedUser().subscribe({
      next: () => {
        if (redirectUrl.length > 0) {
          window.location.href = redirectUrl;
        }
      },
      error: () => this.firstLogin(redirectUrl)
    });
  }

  logout(redirectUrl: string = '') {
    if (redirectUrl.length === 0) {
      redirectUrl = window.location.href;
    }
    localStorage.clear();
    this.currentUserSubject.next(null);
    window.location.href = this.esgbuApi.baseApiUrl + 'logout?return=' + redirectUrl;
  }

  getCurrentUser() {
    return this.currentUserObs;
  }

  getCurrentUserInfo() {
    return this.currentUserSubject.value;
  }

  getAPIConnectedUser() {
    return this.esgbuApi.get(this.authentSuccessUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  forceValidUser(userId: number) {
    const fakeToken = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const url = this.baseUrl + '/confirm/' + fakeToken + '?userId=' + userId + '&return=false';

    return this.esgbuApi.get(url, true, 'csrfToken')
      .pipe(catchError(this.esgbuApi.handleError));
  }


  private firstLogin(redirectUrl: string = '') {
    if (redirectUrl.length === 0) {
      redirectUrl = window.location.href;
    }
    window.location.href = this.esgbuApi.baseApiUrl + 'secure/Login?return=' + redirectUrl;
  }
}
