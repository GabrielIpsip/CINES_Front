import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-confirm-mail',
  templateUrl: './error-confirm-mail.component.html',
  styleUrls: ['./error-confirm-mail.component.scss']
})
export class ErrorConfirmMailComponent implements OnInit, OnDestroy {

  private currentUserSub: Subscription;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          const userValid = value.valid;

          if (userValid) {
            this.router.navigateByUrl('/');
          }

        }
      }
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

}
