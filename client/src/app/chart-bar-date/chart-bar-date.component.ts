import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-chart-bar-date',
  templateUrl: './chart-bar-date.component.html',
  styleUrls: ['./chart-bar-date.component.css'],
})
export class ChartBarDateComponent implements OnInit {
  data: object[] = [];
  aggData: any = { without: [], day: [], week: [], month: [], year: [] };
  loading: boolean;
  formatting: any;

  //intervals: string[] = ['1d', '1w', '1m', '1y'];
  intervals: string[] = ['without', 'day', 'week', 'month', 'year'];
  interval: string = 'without';
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

  constructor(private taskService: TaskService) {
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
    this.getFieldCountPerInterval(this.intervals[this.interval]);
  }

  changeInterval() {
    //this.getFieldCountPerInterval(this.intervals[this.interval]);

    console.log(this.interval);
    this.data = this.aggData[this.interval];
  }

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
            x: bucket.key,
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
              return moment(bucket['x']).startOf(interval as any);
            }),
          };
        });

        currAgg = _.map(currAgg, series => {
          return {
            name: series.name,
            series: _.map(series['series'], (bucket, key) => {
              return { x: moment(key).valueOf(), y: bucket.length };
            }),
          };
        });

        this.aggData[interval] = currAgg;
      }
    });
    this.data = this.aggData.without; //default
  }

  getFieldCountPerInterval(interval: string = '1d'): void {
    this.loading = true;
    this.taskService.getFieldCountPerInterval(interval).subscribe(data => {
      //Move slide to correct position
      // this.interval = this.intervals.indexOf(interval);
      //data array of series [due,created]
      this.loading = false;
      this.editData(data);
    });
  }

  getTask(event) {
    this.taskService.getTasksByFilter({
      date: event.category,
      name: event.series.name,
      interval: this.interval,
    });
  }
}
