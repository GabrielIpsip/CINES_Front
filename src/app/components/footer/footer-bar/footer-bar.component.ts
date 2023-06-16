import { Component } from '@angular/core';
import { EnvironmentService } from 'src/app/services/environment.service';
import { UsersService } from 'src/app/services/users.service';
import version from '../../../../assets/version.json';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent {

  readonly about = '/about';
  readonly cgu = '/cgu';
  readonly credits = '/credits';
  readonly rgpd = '/rgpd';
  readonly contact = '/contact';
  readonly usefulLinks = '/useful-links';

  readonly allMenuUrl = [this.about, this.cgu, this.credits, this.rgpd, this.contact, this.usefulLinks];

  constructor(
    private envService: EnvironmentService,
    private usersService: UsersService
  ) { }

  get apiVersion(): string {
    return version.apiVersion;
  }

  get apiUrl(): string {
    return this.envService.environment.apiUrl;
  }

  onClickApiUrl() {
    if (this.usersService.getCurrentUserInfo() !== null) {
      window.open(this.apiUrl, '_blank', 'noopener noreferrer');
    } else {
      this.usersService.login(this.apiUrl);
    }
  }

}
