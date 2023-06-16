import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FileItem } from 'src/app/common/FileItem';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-routes-files-list',
  templateUrl: './routes-files-list.component.html',
  styleUrls: ['./routes-files-list.component.scss']
})
export class RoutesFilesListComponent implements OnInit {

  @Input() routeName: string;
  @Input() showImage: boolean;
  @Input() showDocument: boolean;
  @Input() editMode: boolean;

  associatedImages: FileItem[];
  associatedFiles: FileItem[];
  uploadImageEventSource: EventSource;
  fileItem = FileItem;

  constructor(
    private routesService: RoutesService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshImageList();
    this.refreshFileList();

    this.uploadImageEventSource = this.routesService.getEventSource();
    this.uploadImageEventSource.onmessage = event => {
      if (event.data === this.routesService.uploadImageMessage) {
        this.refreshImageList();
      }
    };
  }

  deleteFile(fileUrl: string, image = false) {
    this.routesService.deleteFile(fileUrl).subscribe({
      next: () => {
        if (image) {
          this.refreshImageList();
        } else {
          this.refreshFileList();
        }
      }
    });
  }

  refreshImageList() {
    if (this.routeName == null) {
      return;
    }

    this.routesService.getListFile(this.routeName, true).subscribe({
      next: (response) => {
        this.associatedImages = response;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        if (error.status === 404) {/* Do nothing */ }
      }
    });
  }

  onFileSelected(fileInputEvent: any) {
    const files: File[] = fileInputEvent.target?.files;
    if (files?.length > 0) {
      for (const file of files) {
        this.routesService.uploadFile(this.routeName, file).subscribe({
          next: () => this.refreshFileList()
        });
      }
    }
  }

  private refreshFileList() {
    this.routesService.getListFile(this.routeName).subscribe({
      next: (response) => this.associatedFiles = response,
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

}
