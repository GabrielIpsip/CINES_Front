import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: boolean;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.loaderService.isLoadingSubj.subscribe({
      next: (value) => {
        setTimeout(() => {
          this.isLoading = value;
        }, 0);
      }
    });
  }
}
