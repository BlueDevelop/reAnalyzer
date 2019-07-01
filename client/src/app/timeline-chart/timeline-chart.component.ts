import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Chart } from 'highcharts/highcharts.src';
import * as more_HC from 'highcharts/highcharts-more.src';
more_HC(Highcharts);
@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.css'],
})
export class TimelineChartComponent implements OnInit, OnChanges {
  @Input()
  data: any[];
  @Input()
  innerSize: string;
  @Input()
  interval: string = 'without';
  @Input()
  zoomtype: string = 'x';
  @Input()
  isTimeline: boolean = true;
  @Input()
  title: string = '';
  @Output()
  getTasks: EventEmitter<object> = new EventEmitter<object>();

  chart: Highcharts.Chart;
  updateFlag = true;
  Highcharts = Highcharts;
  colors: string[] = [];
  intervals: string[] = [
    'without',
    'day',
    'week',
    'month',
    'year',
    'dayName',
    'dateWithoutYear',
    'dayInMonth',
  ];
  dayNames: object = {
    Sunday: 'ראשון',
    Monday: 'שני',
    Tuesday: 'שלישי',
    Wednesday: 'רביעי',
    Thursday: 'חמישי',
    Friday: 'שישי',
    Saturday: 'שבת',
  };
  names: object = {
    due: 'תאריך יעד',
    created: 'תאריך יצירה',
    prediction: 'חיזוי',
    weeklyPrediction: 'חיזוי שבועי',
    trendPrediction: 'חיזוי טרנד',
    monthlyPrediction: 'חיזוי חודשי',
    yearlyPrediction: 'חיזוי שנתי',
  };
  chartOptions: any = {
    chart: {
      height: window.innerHeight * 0.4,
      zoomType: this.zoomtype,
    },
    title: {
      text: this.title,
    },
    legend: {
      enabled: true,
    },
    xAxis: {
      ...this.xAxisFormat(),
      // tickInterval: 7 * 24 * 36e5, // one week - how often labels are shown on the x axis
      // labels: {
      //   format: '{value:Week %W/%Y}',
      //   align: 'right',
      //   rotation: -30,
      // }, // shows a week from year
      title: {
        text: 'תאריכים',
      },
      type: 'datetime',
      //
      // categories: _.map(this.data, point => moment(point.x).toISOString()),
    },
    yAxis: {
      title: {
        text: 'כמות משימות',
      },
    },
    plotOptions: {},
    tooltip: {
      crosshairs: true,
      shared: true,
      useHTML: true,
      format:
        '<small style="direction:rtl">{point.name}:{point.y}</small><br/>',
      // headerFormat: '<small style="direction:rtl">{point.name}</small><br/>',
      // pointFormat: '{point.percentage:.1f} %',
    },
    series: [
      {
        type: 'area',
        data: [],
        size: '70%',
        showInLegend: true,
        colors: this.colors,
      },
    ],
  };
  constructor(private settingsService: SettingsService) {
    (Highcharts.dateFormats as any) = {
      ...Highcharts.dateFormats,
      W: function(timestamp) {
        return moment(timestamp).isoWeeks();
      },
      D: function(timestamp) {
        return moment(timestamp).date(); //day of month 1-31
      },
      M: function(timestamp) {
        return moment(timestamp).month() + 1; //month
      },
      H: function(timestamp) {
        return moment(timestamp).hour(); //hour
      },
      R: function(timestamp) {
        const dayNames: object = {
          Sunday: 'ראשון',
          Monday: 'שני',
          Tuesday: 'שלישי',
          Wednesday: 'רביעי',
          Thursday: 'חמישי',
          Friday: 'שישי',
          Saturday: 'שבת',
        };
        return dayNames[
          moment(timestamp)
            .format('dddd')
            .toString()
        ];
        // return moment(timestamp).format('dddd');
      },
      A: function(timestamp) {
        const a = moment(timestamp);
        return `${a.date()}/${a.month() + 1}`;
      },
      B: function(timestamp) {
        return moment(timestamp).date();
      },
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }
  ngOnInit() {
    this.chartOptions.title.text = this.title;
    console.log(`title:${this.title}`);
    this.colors = this.settingsService.getColorDomain(this.data.length);
    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        height: window.innerHeight * 0.4,
        zoomType: this.zoomtype,
      },
      xAxis: {
        ...this.staticXAxis(),
        ...this.xAxisFormat(),
      },
      colors: this.colors,
      series: this.generateSeries(),
    };
  }
  generateSeries() {
    return _.map(this.data, (series, i) => {
      if (series.name != 'Range') {
        return {
          name: this.names[series.name],
          data: series.series,
          type: 'line',
          showInLegend: true,
          zIndex: 1,
          colors: this.colors,
          events: {
            click: e => this.getTasks.emit(e.point),
          },
          marker: {
            fillColor: 'white',
            lineWidth: 1,
            lineColor: this.colors[i],
          },
        };
      } else {
        return {
          name: series.name,
          data: series.series,
          type: 'arearange',
          lineWidth: 0,
          linkedTo: ':previous',
          fillOpacity: 0.3,
          zIndex: 0,
          colors: this.colors,
          showInLegend: false,
          marker: {
            enabled: false,
          },
        };
      }
    });
  }
  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  onResize() {
    this.chart.update({
      chart: {
        height: window.innerHeight * 0.4,
      },
    });
    this.chart.reflow();
  }

  staticXAxis() {
    return {
      title: {
        text: 'תאריכים',
      },
      type: 'datetime',
    };
  }
  xAxisFormat() {
    switch (this.interval) {
      case this.intervals[0]: //without
        return {
          // tickInterval: 24 * 36e5, // one  day
          minTickInterval: 36e5, // one  hour
          labels: {
            // format: '{value: %H/%D/%M/%Y}',
            format: '{value: %D/%M/%Y : %H}',
            align: 'right',
            rotation: -30,
          },
        };
      case this.intervals[1]: //day
        return {
          // tickInterval: 24 * 36e5, // one  day
          minTickInterval: 24 * 36e5, // one  day
          labels: {
            format: '{value: %D/%M/%Y}',
            align: 'right',
            rotation: -30,
          },
        };
      case this.intervals[2]: //week
        return {
          // tickInterval: 7 * 24 * 36e5, // one week
          minTickInterval: 7 * 24 * 36e5, // one week
          labels: {
            format: '{value: %W/%Y}',
            align: 'right',
            rotation: -30,
          },
        };
      case this.intervals[3]: //month
        return {
          // tickInterval: undefined,
          // minTickInterval: 28 * 24 * 3600 * 1000, //one month
          labels: {
            format: '{value: %M/%Y}',
            align: 'right',
            rotation: -30,
          },
        };
      case this.intervals[4]: //year
        return {
          // tickInterval: undefined,
          // minTickInterval: 365 * 24 * 3600 * 1000, //one non leap year
          labels: {
            format: '{value: %Y}',
            align: 'right',
            rotation: -30,
          },
        };
      case this.intervals[5]: //dayName
        return {
          labels: {
            format: '{value: %R}',
            // align: 'right',
            // rotation: -30,
          },
        };

      case this.intervals[6]: //dateWithoutYear
        return {
          labels: {
            format: '{value: %A}',
            // align: 'right',
            // rotation: -30,
          },
        };
      case this.intervals[7]: //dayInMonth
        return {
          labels: {
            format: '{value: %B}',
            // align: 'right',
            // rotation: -30,
          },
        };
    }
  }
}
