import { Component, OnInit } from '@angular/core';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.css'],
})
export class RefreshButtonComponent implements OnInit {
  private interval: number = 0;
  constructor(private refresh: RefreshService) {}

  ngOnInit() {}
  updateInterval(interval) {
    this.interval = interval;
    this.refresh.updateInterval(interval);
  }
}
