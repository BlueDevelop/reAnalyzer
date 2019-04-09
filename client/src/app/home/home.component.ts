import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private inProgress: number = 0;
  constructor(
    private refresh: RefreshService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.refresh.inProgressObservable.subscribe(newVal => {
      this.inProgress = newVal;
      this.cdRef.detectChanges();
    });
  }
}
