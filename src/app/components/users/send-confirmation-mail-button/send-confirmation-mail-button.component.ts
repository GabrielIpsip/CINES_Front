import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-confirmation-mail-button',
  templateUrl: './send-confirmation-mail-button.component.html',
  styleUrls: ['./send-confirmation-mail-button.component.scss']
})
export class SendConfirmationMailButtonComponent {

  @Input() redirectHome = false;

  mailSend = false;

  private readonly mailSendValidationKey = 'info.confirmEmailSend';
  private readonly mailSendErrorKey = 'error.sendConfirmMailError';

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private usersService: UsersService,
    private router: Router
  ) { }

  onClickSendMailButton() {
    this.usersService.sendConfirmationMail().subscribe({
      next: () => this.afterSendValidationMail(),
      error: () => this.showPopup(this.mailSendErrorKey)
    });
  }

  private afterSendValidationMail() {
    this.showPopup(this.mailSendValidationKey);
    if (this.redirectHome) {
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 5000);
    }
  }

  private showPopup(key: string) {
    let message: string;

    this.translate.stream(key).subscribe({
      next: (value) => {
        message = value;
        if (this.redirectHome) {
          this.translate.stream('info.redirectionMessage').subscribe({
            next: (value2) => message += ' ' + value2
          });
        }
      }
    });

    this.snackBar.open(message, null, { duration: 5000 });
  }

}
