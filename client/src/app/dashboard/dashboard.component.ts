import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { FilterService } from '../_services/filter.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete,
} from '@angular/material';
import * as _moment from 'moment';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('barDate')
  barDate;
  @ViewChild('pieStatus')
  pieStatus;
  @ViewChild('leaderBoard')
  leaderBoard;
  @ViewChild('tagCloud')
  tagCloud;
  @ViewChild('timeRates')
  timeRates;

  constructor(
    private taskService: TaskService,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private refresh: RefreshService
  ) {
    //initial data load
    this.refresh.source.subscribe(() => this.dataFilering()); //refresh;
  }

  ngOnInit() {
    // this.dataFilering();
    // this.settingsService.initColorsArray().subscribe(() => {
    //console.log(this.settingsService.colorsArray);
    this.dataFilering();
    // });
  }

  dataFilering() {
    // this.settingsService.initColorsArray();
    // this.settingsService.initColorsArray().subscribe(() => {
    // setTimeout(() => {
    this.barDate.getFieldCountPerInterval();
    this.pieStatus.getCountByStatus();
    this.leaderBoard.getLeaderboard();
    this.tagCloud.getTagClouds();
    this.timeRates.getTimeRates();
    // }, 0);

    // });
  }
}
