import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Routes } from 'src/app/models/routes.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { RoutesService } from 'src/app/services/routes.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-about',
  templateUrl: './footer-route.component.html',
  styleUrls: ['./footer-route.component.scss']
})
export class FooterRouteComponent implements OnInit, OnDestroy {

  routeContent: Routes;

  isDiCoDoc = false;
  currentUserSub: Subscription;

  constructor(
    private routesService: RoutesService,
    private translate: TranslateService,
    private router: Router,
    private rightsChecker: RightsCheckerService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    const routeName = this.router.url.slice(1);
    this.routesService.getRouteByName(routeName, this.translate.getDefaultLang()).subscribe({
      next: (response) => this.routeContent = response
    });

    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          this.isDiCoDoc = this.rightsChecker.isADMIN();
        }
      }
    });
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}
