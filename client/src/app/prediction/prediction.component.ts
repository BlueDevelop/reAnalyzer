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
  JUL,
} from '@angular/material/core';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete,
} from '@angular/material';
import * as _moment from 'moment';
import { RefreshService } from '../_services/refresh.service';
import { PredictionService } from '../_services/prediction.service';
import { filter } from 'rxjs/operators';
// import moment = require('moment');
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css'],
})
export class PredictionComponent implements OnInit {
  @ViewChild('filter')
  filter;
  @ViewChild('prediction')
  prediction;
  @ViewChild('weekly')
  weekly;
  @ViewChild('monthly')
  monthly;
  @ViewChild('yearly')
  yearly;
  timelinePrediction: any = [];
  weeklyPrediction: any = [];
  trendPrediction: any = [];
  yearlyPrediction: any = [];
  monthlyPrediction: any = [];
  dayOrders: Object = {
    Sunday: 1,
    Monday: 2,
    Tuesday: 3,
    Wednesday: 4,
    Thursday: 5,
    Friday: 6,
    Saturday: 7,
  };
  title: string = '';
  constructor(
    private predictionService: PredictionService,
    private filterService: FilterService,
    private settingsService: SettingsService,
    private refresh: RefreshService
  ) {
    //initial data load
    this.refresh.source.subscribe(() => this.dataFilering()); //refresh;
  }

  dataFilering() {
    this.refresh.increaseProgress();
    const dateType = this.filter.dateType ? this.filter.dateType : 'due';
    this.predictionService
      .predictFieldCountPerInterval(dateType)
      .subscribe(data => {
        const fieldSeries: any = _.map(data.existingData, item => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.y,
          };
        });
        const predictionSeries: any = _.map(data.forcast, item => {
          return [_moment.parseZone(item.ds).valueOf(), item.yhat];
        });

        const rangesSeries: any = _.map(data.forcast, item => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.yhat_lower,
            item.yhat_upper,
          ];
        });
        this.timelinePrediction = [
          {
            name: data.field,
            series: fieldSeries,
          },
          {
            name: 'prediction',
            series: predictionSeries,
          },
          {
            name: 'Range',
            series: rangesSeries,
          },
        ];

        let i = _.findIndex(data.forcast, (item: any) => {
          return _moment(item.ds).format('dddd') == 'Sunday';
        });

        const weeklyForcastArray = data.forcast.slice(i, i + 7);

        const weeklySeries: any = _.map(weeklyForcastArray, item => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.weekly,
          };
        });

        const weeklyRangesSeries: any = _.map(weeklyForcastArray, item => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.weekly_lower,
            item.weekly_upper,
          ];
        });
        this.weeklyPrediction = [
          {
            name: 'weeklyPrediction',
            series: weeklySeries,
          },
          {
            name: 'Range',
            series: weeklyRangesSeries,
          },
        ];

        const trendSeries: any = _.map(data.forcast, (item: any) => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.trend,
          };
        });

        const trendRangesSeries: any = _.map(data.forcast, (item: any) => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.trend_lower,
            item.trend_upper,
          ];
        });
        this.trendPrediction = [
          {
            name: 'trendPrediction',
            series: trendSeries,
          },
          {
            name: 'Range',
            series: trendRangesSeries,
          },
        ];

        let yearlyData = _.sortBy(data.forcast, (item: any) => {
          return _moment(item.ds).dayOfYear();
        });
        yearlyData = _.map(yearlyData, item => {
          let m = _moment(item.ds);
          const nextYear = _moment().year() + 1;
          m.set('year', nextYear);
          return {
            ds: m.valueOf(),
            yearly: item.yearly,
            yearly_lower: item.yearly_lower,
            yearly_upper: item.yearly_upper,
          };
        });

        const yearlySeries: any = _.map(yearlyData, item => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.yearly,
          };
        });

        const yearlyRangesSeries: any = _.map(yearlyData, item => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.yearly_lower,
            item.yearly_upper,
          ];
        });
        this.yearlyPrediction = [
          {
            name: 'yearlyPrediction',
            series: yearlySeries,
          },
          {
            name: 'Range',
            series: yearlyRangesSeries,
          },
        ];

        i = _.findIndex(data.forcast, (item: any) => {
          return _moment(item.ds).date() == 1;
        });
        let monthlyData = _.sortBy(data.forcast.slice(i, i + 28), item => {
          return _moment(item.ds).date();
        });
        let lastDay = _moment(monthlyData[monthlyData.length - 1].ds).date();
        // console.log(`lastDay=${lastDay}`);
        for (let j = lastDay + 1; j <= 31; j++) {
          let f = _.find(data.forcast, function(obj) {
            return _moment(obj.ds).date() == j;
          });
          // console.log(`j=${j}`);
          // console.log(f);
          monthlyData.push(f);
        }
        monthlyData = _.map(monthlyData, item => {
          let m = _moment(item.ds);
          const nextYear = _moment().year() + 1;
          m.set('year', nextYear);

          m.set('month', 7);
          m.set('year', nextYear);
          return {
            ds: m.valueOf(),
            monthly: item.monthly,
            monthly_lower: item.monthly_lower,
            monthly_upper: item.monthly_upper,
          };
        });
        // console.log('Hello man');
        for (let j = 0; j < monthlyData.length; j++) {
          // console.log(
          //   `j=${j}   ,    ${_moment(monthlyData[j].ds).toString()}     ${
          //     monthlyData[i].monthly
          //   }`
          // );
        }

        const monthlySeries: any = _.map(monthlyData, item => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.monthly,
          };
        });

        const monthlyRangesSeries: any = _.map(monthlyData, item => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.monthly_lower,
            item.monthly_upper,
          ];
        });
        this.monthlyPrediction = [
          {
            name: 'monthlyPrediction',
            series: monthlySeries,
          },
          {
            name: 'Range',
            series: monthlyRangesSeries,
          },
        ];
        this.refresh.decreaseProgress();
      });
  }

  ngOnInit() {
    this.dataFilering();
  }
}
