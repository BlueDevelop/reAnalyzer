import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import { SettingsService } from '../_services/settings.service';
@Component({
  selector: 'app-time-rates',
  templateUrl: './time-rates.component.html',
  styleUrls: ['./time-rates.component.css'],
})
export class TimeRatesComponent implements OnInit {
  data: object[] = [];
  loading: boolean;
  constructor(
    private taskService: TaskService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.getTimeRates();
  }

  getTimeRates(): void {
    this.loading = true;
    this.taskService.getTimeRates().subscribe(data => {
      this.loading = false;
      this.data = data.ratios;
    });
  }
}
