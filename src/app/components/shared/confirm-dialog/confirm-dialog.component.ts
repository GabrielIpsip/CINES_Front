import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  hideNoButton?: boolean;
  noShowMoreCheckBoxID?: string;
  yesButtonText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  hideNoButton = false;
  yesButtonText = 'action.confirm';
  noShowMoreCheckBoxID: string;

  noShowMore = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  ngOnInit() {
    if (this.data == null) {
      return;
    }

    if (this.data.title != null) {
      this.title = this.data.title;
    }

    if (this.data.message != null) {
      this.message = this.data.message;
    }

    if (this.data.hideNoButton != null) {
      this.hideNoButton = this.data.hideNoButton;
    }

    if (this.data.yesButtonText != null) {
      this.yesButtonText = this.data.yesButtonText;
    }

    if (this.data.noShowMoreCheckBoxID != null) {
      this.noShowMoreCheckBoxID = this.data.noShowMoreCheckBoxID;
    }
  }

  onNoClick(): void {
    localStorage.setItem(this.noShowMoreCheckBoxID, JSON.stringify(this.noShowMore));
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    localStorage.setItem(this.noShowMoreCheckBoxID, JSON.stringify(this.noShowMore));
    this.dialogRef.close(true);
  }


}
