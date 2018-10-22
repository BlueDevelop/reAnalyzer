import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class DashboardComponent implements OnInit {
  @ViewChild('barDate') barDate;
  @ViewChild('pieStatus') pieStatus;
  @ViewChild('leaderBoard') leaderBoard;
  @ViewChild('tagCloud') tagCloud;

  selected = 'option2';

  events: string[] = [];
  date = _moment().subtract(1, 'month');
  startDate = new FormControl(this.date);
  endDate = new FormControl(_moment());

  // myFilter = (d: Date): boolean => {
  //   const day = d.getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // }

  constructor(private taskService: TaskService) {
    this.taskService.firstDay = this.startDate.value.valueOf();
    this.taskService.lastDay = this.endDate.value.valueOf();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.taskService.firstDay = this.startDate.value.valueOf();
    this.taskService.lastDay = this.endDate.value.valueOf();
    this.barDate.getFieldCountPerInterval();
    this.pieStatus.getCountByStatus();
    this.leaderBoard.getLeaderboard();
    this.tagCloud.getTagClouds();
  }

  ngOnInit() {
    console.log(_moment().subtract(1, 'month').format('DD/MM/YYYY'));
  }

}
