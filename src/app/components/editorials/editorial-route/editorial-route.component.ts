import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { RoutesService } from 'src/app/services/routes.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-editorial-route',
  templateUrl: './editorial-route.component.html',
  styleUrls: ['./editorial-route.component.scss']
})
export class EditorialRouteComponent implements OnInit, OnDestroy {

  routeName: string;

  editorial: any;

  isDiCoDoc = false;
  currentUserSub: Subscription;

  constructor(
    private rightsChecker: RightsCheckerService,
    private usersService: UsersService,
    private routesService: RoutesService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.routeName = this.routesService.editorialRouteName;

    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          this.isDiCoDoc = this.rightsChecker.isADMIN();
        }
      }
    });

    this.routesService.getRouteByName(this.routeName, this.translate.getDefaultLang()).subscribe({
      next: (response) => this.editorial = JSON.parse(response.content)
    });
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }

}
