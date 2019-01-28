import { Component, OnInit, Input } from '@angular/core';
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
    .slice(0, 1)
    .join(' ');
};

@Component({
  selector: 'app-leaderboard-chart',
  templateUrl: './leaderboard-chart.component.html',
  styleUrls: ['./leaderboard-chart.component.css'],
})
export class LeaderboardChartComponent implements OnInit {
  @Input()
  data: any;
  @Input()
  innerSize: string;
  @Input()
  name: string;
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
      },
    },
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    tooltip: {
      useHTML: true,
      format:
        '<small style="direction:rtl">{point.name}:{point.y}</small><br/>',
      // headerFormat: '<small style="direction:rtl">{point.name}</small><br/>',
      // pointFormat: '{point.percentage:.1f} %',
    },
    series: [
      {
        name: this.name,
        colorByPoint: true,
        dataLabels: {
          outside: true,
          useHTML: Highcharts['hasBidiBug'],
          enabled: true,
          // headerFormat:
          //   '<small style="direction:rtl">{point.name}</small><br/>',
          // pointFormat: '{point.percentage:.1f} %',
          // color: 'red',
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
  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    console.log('leaderboard-init');
    console.log(this.chart);
    console.log('leaderboard data');
    console.log(this.data);
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
        },
        {
          name: 'משימות שהושלמו',
          data: this.data.done,
          color: this.colors[1],
        },
      ],
      // series: [
      //   {
      //     ...this.chartOptions.series[0],
      //     name: this.name,
      //     // data: this.data,
      //     colors: this.colors,
      //   },
      // ],
    };
    // this.chart.update(this.chartOptions);
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
    console.log(this.chart);
  }
}
