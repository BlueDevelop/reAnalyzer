import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
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
  name: string;
  chart: Highcharts.Chart;
  updateFlag = true;
  Highcharts = Highcharts;
  colors: string[] = [];
  chartOptions: any = {
    chart: {
      height: window.innerHeight * 0.38,
      zoomType: 'x',
    },
    title: {
      text: '',
    },
    legend: {
      enabled: true,
    },
    xAxis: {
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
      useHTML: true,
      format:
        '<small style="direction:rtl">{point.name}:{point.y}</small><br/>',
      // headerFormat: '<small style="direction:rtl">{point.name}</small><br/>',
      // pointFormat: '{point.percentage:.1f} %',
    },
    series: [
      {
        type: 'area',
        name: this.name,
        data: [],
        size: '80%',
        showInLegend: true,
        colors: this.colors,
      },
    ],
  };
  constructor(private settingsService: SettingsService) {}
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.ngOnInit();
  }
  ngOnInit() {
    console.log('timeline data:');
    console.log(this.data);
    this.colors = this.settingsService.getColorDomain(this.data.length);
    this.chartOptions = {
      ...this.chartOptions,
      colors: this.colors,
      series: [
        {
          ...this.chartOptions.series[0],
          name: this.name,
          data: this.data,
        },
      ],
    };
    // this.chart.update(this.chartOptions);
  }

  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  onResize() {
    this.chart.update({
      chart: {
        height: window.innerHeight * 0.38,
      },
    });
    this.chart.reflow();
  }
}
