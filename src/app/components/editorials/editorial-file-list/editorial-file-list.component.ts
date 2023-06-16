import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileItem } from 'src/app/common/FileItem';
import { EditorialsService } from 'src/app/services/editorials.service';

@Component({
  selector: 'app-editorial-file-list',
  templateUrl: './editorial-file-list.component.html',
  styleUrls: ['./editorial-file-list.component.scss']
})
export class EditorialFileListComponent implements OnInit, OnDestroy {

  @Input() surveyId: number;
  @Input() editMode = false;

  uploadImageEventSource: EventSource;

  associatedFiles: FileItem[];
  associatedImages: FileItem[];

  fileItem = FileItem;

  constructor(
    private editorialsService: EditorialsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshFileList();
    if (this.editMode) {
      this.refreshImageList();

      this.uploadImageEventSource = this.editorialsService.getEventSource();
      this.uploadImageEventSource.onmessage = event => {
        if (event.data === this.editorialsService.uploadImageMessage) {
          this.refreshImageList();
        }
      };
    }
  }

  ngOnDestroy() {
    if (this.uploadImageEventSource != null) {
      this.uploadImageEventSource.close();
    }
  }

  onFileSelected(fileInputEvent: any) {
    const files: File[] = fileInputEvent.target?.files;
    if (files?.length > 0) {
      for (const file of files) {
        this.editorialsService.uploadFile(this.surveyId, file).subscribe({
          next: () => this.refreshFileList()
        });
      }
    }
  }

  deleteFile(fileUrl: string, image = false) {
    this.editorialsService.deleteFile(fileUrl).subscribe({
      next: () => {
        if (image) {
          this.refreshImageList();
        } else {
          this.refreshFileList();
        }
      }
    });
  }

  private refreshFileList() {
    this.editorialsService.getListFile(this.surveyId).subscribe({
      next: (response) => this.associatedFiles = response,
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  refreshImageList() {
    this.editorialsService.getListFile(this.surveyId, true).subscribe({
      next: (response) => {
        this.associatedImages = response;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        if (error.status === 404) {/* Do nothing */ }
      }
    });
  }
}
