import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { TaskService } from '../_services/task.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';

const colors: string[] = ['#ff0000', '#00ff00', '#0000ff'];

const formatXLabels = (str: string) => {
  return str
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join(' ');
};

@Component({
  selector: 'app-leaderboard-chart',
  templateUrl: './leaderboard-chart.component.html',
  styleUrls: ['./leaderboard-chart.component.css'],
})
export class LeaderboardChartComponent implements OnInit, OnChanges {
  @Input()
  title: string = '';
  @Input()
  data: any;
  @Input()
  innerSize: string;
  @Input()
  name: string;
  @Output()
  getTasks: EventEmitter<object> = new EventEmitter<object>();
  chart: Highcharts.Chart;
  updateFlag = true;
  Highcharts = Highcharts;
  colors: string[] = [];
  chartOptions: any = {
    chart: {
      height: window.innerHeight * 0.41,
      type: 'bar',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    },
    plotOptions: {
      series: {
        stacking: 'percent',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %',
        },
      },
    },
    title: {
      text: this.title,
    },
    yAxis: {
      title: {
        text: '',
      },
      labels: {
        enabled: false,
      },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      lineColor: 'transparent',
      tickLength: 0,
      minorTickLength: 0,
      startOnTick: false,
      endOnTick: false,
      tickPositions: [],
    },
    xAxis: {
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      lineColor: 'transparent',
      tickLength: 0,
      minorTickLength: 0,
      startOnTick: false,
      endOnTick: false,
      tickPositions: [],
    },

    tooltip: {
      useHTML: true,
      format:
        '<small style="direction:rtl">{point.name}:{point.y}</small><br/>',
    },
    series: [
      {
        name: this.name,
        colorByPoint: true,
        dataLabels: {
          outside: true,
          useHTML: Highcharts['hasBidiBug'],
          enabled: true,
          format: '{point.percentage:.1f} %',
        },
        data: [],
        size: '80%',
        innerSize: this.innerSize,
        showInLegend: true,
        colors: this.colors,
      },
    ],
  };
  constructor(private settingsService: SettingsService) {
    this.settingsService.colorsArrayBS.subscribe(() => {
      this.colors = this.settingsService.getColorDomain(2);
      //console.log('something');
      //console.log(this.colors);
      // this.chart.redraw();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }
  ngOnInit() {
    this.chartOptions.title.text = this.title;
    this.colors = this.settingsService.getColorDomain(2);
    this.chartOptions = {
      ...this.chartOptions,
      xAxis: {
        categories: this.data.keys,
        labels: {
          formatter: function() {
            return formatXLabels(this.value);
          },
        },
        title: {
          text: null,
        },
      },
      series: [
        {
          name: 'שאר המשימות',
          data: this.data.total,
          color: this.colors[0],
          events: {
            click: e => this.getTasks.emit(e.point),
          },
        },
        {
          name: 'משימות שהושלמו',
          data: this.data.done,
          color: this.colors[1],
          events: {
            click: e => this.getTasks.emit(e.point),
          },
        },
      ],
    };
  }

  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  onResize() {
    this.chart.update({
      chart: {
        height: window.innerHeight * 0.41,
      },
    });
    this.chart.reflow();
    //console.log(this.chart);
  }
}
