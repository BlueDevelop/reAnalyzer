import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
import { SettingsService } from '../_services/settings.service';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-chart-bar-date',
  templateUrl: './chart-bar-date.component.html',
  styleUrls: ['./chart-bar-date.component.css'],
})
export class ChartBarDateComponent implements OnInit {
  data: object[] = [];
  aggData: any = { without: [], day: [], week: [], month: [], year: [] };
  empty: boolean = false;
  formatting: any;
  @Input()
  title: string = '';
  @Input()
  mainDashboard: boolean;

  intervals: string[];
  interval: string = this.settings.interval || 'year';
  changeInterval: Function;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    private settings: SettingsService,
    private refresh: RefreshService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    if (this.mainDashboard) {
      this.intervals = ['week', 'month', 'year'];
      this.changeInterval = this.changeIntervalMainDashboard;
    } else {
      this.intervals = ['without', 'day', 'week', 'month', 'year'];
      this.changeInterval = this.changeIntervalSecondaryDashboard;
    }

    this.empty = true;
    this.interval = this.settings.interval;
    this.getFieldCountPerInterval();
  }

  changeIntervalSecondaryDashboard() {
    this.settings.interval = this.interval;
    this.data = this.aggData[this.settings.interval];
  }

  changeIntervalMainDashboard() {
    this.settings.interval = this.interval;
    this.data = this.aggData['this_' + this.settings.interval];
  }

  editData(data): void {
    this.data = _.map(data, series => {
      return {
        name: series.field,
        series: _.map(series.data, bucket => {
          return {
            x: moment.parseZone(bucket.key_as_string).valueOf(),
            y: bucket.doc_count,
          };
        }),
      };
    });
    this.aggData.without = this.data;
    if (!this.mainDashboard) {
      _.forEach(this.intervals, interval => {
        if (interval != 'without') {
          let currAgg: any = _.map(this.data, series => {
            return {
              name: series['name'],
              series: _.groupBy(series['series'], bucket => {
                return moment(bucket['x']).startOf(interval as any);
              }),
            };
          });

          currAgg = _.map(currAgg, series => {
            return {
              name: series.name,
              series: _.map(series['series'], (bucket, key) => {
                return {
                  x: bucket[0].x,
                  y: _.sumBy(bucket, (o: any) => o.y),
                };
              }),
            };
          });

          this.aggData[interval] = currAgg;
        }
      });
      this.data = this.aggData[this.settings.interval]; //default
    } else {
      _.forEach(this.intervals, interval => {
        if (interval != 'without' && interval != 'day') {
          let currFilter: any = _.map(this.data, series => {
            return {
              name: series['name'],
              series: _.filter(series['series'], bucket => {
                return moment(bucket['x']).isBetween(
                  moment().startOf(interval as any),
                  moment()
                );
              }),
            };
          });
          this.aggData['this_' + interval] = currFilter;
        }
      });
      this.data = this.aggData['this_' + this.settings.interval]; //default
    }
  }

  getFieldCountPerInterval(): void {
    this.refresh.increaseProgress();
    this.taskService.getFieldCountPerInterval().subscribe(data => {
      this.editData(data);
      this.refresh.decreaseProgress();
      this.empty =
        this.data[0] &&
        this.data[1] &&
        this.data[0]['series'].length === 0 &&
        this.data[1]['series'].length === 0 &&
        this.data[2] &&
        this.data[2]['series'].length === 0;
    });
  }

  getTask(event) {
    this.dialog.open(ModalComponent, {
      data: this.taskService.getTasksByFilter({
        date: event.category,
        name: event.series.name,
        interval: this.settings.interval,
      }),
    });
  }
}
