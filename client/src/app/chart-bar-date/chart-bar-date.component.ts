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
  // dueCanAlakazam: boolean = false;
  // createdCanAlakazam: boolean = false;

  // showDueAlakazam: boolean = false;
  // showCreatedAlakazam: boolean = false;
  //intervals: string[] = ['1d', '1w', '1m', '1y'];
  intervals: string[] = ['without', 'day', 'week', 'month', 'year'];
  interval: string = this.settings.interval || 'without';
  // autoTicks = true;
  // disabled = false;
  // invert = false;
  // max = 3;
  // min = 0;
  // showTicks = true;
  // step = 1;
  // thumbLabel = true;
  // interval = 0;
  // vertical = true;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    private settings: SettingsService,
    private refresh: RefreshService,
    private cdRef: ChangeDetectorRef
  ) {
    // this.formatting = this.format.bind(this);
  }
  // format(x) {
  //   const date = _moment(x);
  //   switch (this.intervals[this.interval]) {
  //     case '1d': {
  //       return date.format('DD/MM/YYYY');
  //     }
  //     case '1w': {
  //       return `${date.week()} ${date.year()}`;
  //     }
  //     case '1m': {
  //       return `${date.month() + 1}/${date.year()}`;
  //     }
  //     case '1y': {
  //       return `${date.year()}`;
  //     }
  //   }
  // }

  ngOnInit() {
    this.empty = true;
    this.interval = this.settings.interval;
    this.getFieldCountPerInterval();
  }

  changeInterval() {
    //this.getFieldCountPerInterval(this.intervals[this.interval]);

    this.settings.interval = this.interval;
    //console.log(this.settings.interval);
    this.data = this.aggData[this.settings.interval];
  }

  predictByCreated() {}

  predictByDue() {}

  // formatLabel(ind: number | null) {
  //   const values = ['יום', 'שבוע', 'חודש', 'שנה'];
  //   return values[ind];
  // }

  // getWeek(millDate: string): string {
  //   const date = _moment(millDate);
  //   return `${date.week()} ${date.year()}`;
  // }
  // generateTooltip(millDate: string): string {
  //   const date = _moment(millDate);
  //   console.log(date);
  //   const sunday = date.day('Sunday');
  //   console.log(sunday);
  //   const nextSunday = sunday.add(7, 'days');
  //   return `${sunday}-${nextSunday}`;
  // }

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
    _.forEach(this.intervals, interval => {
      if (interval != 'without') {
        let currAgg: any = _.map(this.data, series => {
          return {
            name: series['name'],
            series: _.groupBy(series['series'], bucket => {
              // console.log(moment(bucket['x']).startOf(interval as any));
              return moment(bucket['x']).startOf(interval as any);
            }),
          };
        });
        // console.log(interval);
        // console.log(currAgg);
        currAgg = _.map(currAgg, series => {
          return {
            name: series.name,
            series: _.map(series['series'], (bucket, key) => {
              // console.log('after group by bucket');
              // console.log(key);
              // console.log(bucket);
              // console.log(_.sumBy(bucket, (o: any) => o.y));
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
  }

  getFieldCountPerInterval(): void {
    this.refresh.increaseProgress();
    this.taskService.getFieldCountPerInterval().subscribe(data => {
      //Move slide to correct position
      // this.interval = this.intervals.indexOf(interval);
      //data array of series [due,created]
      console.log('the data:::::');
      console.log(data);
      // this.dueCanAlakazam = data[0].canAlakazam;
      // this.createdCanAlakazam = data[1].canAlakazam;
      this.editData(data);
      //this.cdRef.detectChanges();
      this.refresh.decreaseProgress();
      this.empty =
        this.data[0] &&
        this.data[1] &&
        this.data[0]['series'].length === 0 &&
        this.data[1]['series'].length === 0;
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
