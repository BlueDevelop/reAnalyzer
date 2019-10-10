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
  selector: 'app-secondary-dashboard',
  templateUrl: './secondary-dashboard.component.html',
  styleUrls: ['./secondary-dashboard.component.css'],
})
export class SecondaryDashboardComponent implements OnInit {
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
  @ViewChild('myGivenTasks')
  myGivenTasks;
  @ViewChild('myTasks')
  myTasks;
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
    this.dataFilering();
  }

  dataFilering() {
    // this.barDate.getFieldCountPerInterval();
    // this.myGivenTasks.getCountByStatus();
    // this.tagCloud.getTagClouds();
    // this.myTasks.getCountByStatus();

    this.barDate.getFieldCountPerInterval();
    this.pieStatus.getCountByStatus();
    this.leaderBoard.getLeaderboard();
    this.tagCloud.getTagClouds();
    this.timeRates.getTimeRates();
  }
}
