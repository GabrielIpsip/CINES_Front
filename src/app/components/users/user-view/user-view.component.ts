import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() user: Users;
  @Input() firstConnection = false;

  showMailAlert = false;

  statusList: Map<string, boolean>;
  active: boolean;

  userForm: FormGroup = new FormGroup({
    eppnForm: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    mailForm: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.email]),
    phoneForm: new FormControl('', [Validators.pattern('\\+?[0-9]+'), Validators.maxLength(16)]),
    firstnameForm: new FormControl('', [Validators.maxLength(50)]),
    lastnameForm: new FormControl('', [Validators.maxLength(50)])
  });

  constructor(
    private translate: TranslateService
  ) { }

  get f() {
    return this.userForm.controls;
  }

  ngOnInit() {

    this.statusList = new Map<string, boolean>();

    this.translate.onLangChange.subscribe(() => {
      this.statusList = new Map<string, boolean>();
    });

    this.translate.stream('user.view.enabled')
      .subscribe((val: string) => this.statusList.set(val, true));

    this.translate.stream('user.view.disabled')
      .subscribe((val: string) => this.statusList.set(val, false));

    this.f.eppnForm.setValue(this.user.eppn);
    this.f.mailForm.setValue(this.user.mail);
    this.f.phoneForm.setValue(this.user.phone);
    this.f.firstnameForm.setValue(this.user.firstname);
    this.f.lastnameForm.setValue(this.user.lastname);
    this.active = (this.user.active != null) ? this.user.active : false;

    if (this.firstConnection) {
      this.f.eppnForm.disable();
      this.active = true;
    } else if (this.user != null && this.user.eppn != null) {
      this.f.eppnForm.disable();
    }
  }

  getNewValues(): Users {
    this.user.eppn = this.f.eppnForm.value;
    this.user.mail = this.f.mailForm.value;
    this.user.phone = this.f.phoneForm.value;
    this.user.firstname = this.f.firstnameForm.value;
    this.user.lastname = this.f.lastnameForm.value;
    this.user.active = this.active;

    return this.user;
  }

  onKeyDown(event: any) {

    if (event.key !== 'Enter') {
      return;
    }

    const inputId = event.target.id;
    event.preventDefault();

    const inputArray = this.inputs.toArray();
    let nextIndex = 0;

    this.inputs.find((el: MatInput, i: number) => {
      nextIndex = i + 1;
      return el.id === inputId;
    });

    if (nextIndex >= this.inputs.length) {
      nextIndex = 0;
    }

    let nextElement = inputArray[nextIndex];
    if (nextElement.disabled) {
      nextElement = inputArray[0];
    }

    nextElement.focus();
  }

  onFocusMail() {
    if (!this.firstConnection) {
      this.showMailAlert = true;
    }
  }

}
