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

        let i = 0;
        while (_moment(data.forcast[i].ds).format('dddd') != 'Sunday') {
          i++;
        }
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
            item.weekly_lower - 0.1,
            item.weekly_upper + 0.1,
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

        const trendSeries: any = _.map(data.forcast, item => {
          return {
            x: _moment.parseZone(item.ds).valueOf(),
            y: item.trend,
          };
        });

        const trendRangesSeries: any = _.map(data.forcast, item => {
          return [
            _moment.parseZone(item.ds).valueOf(),
            item.trend_lower - 0.1,
            item.trend_upper + 0.1,
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
        this.refresh.decreaseProgress();
      });
  }

  ngOnInit() {
    this.dataFilering();
  }
}
