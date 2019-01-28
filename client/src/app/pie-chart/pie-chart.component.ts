import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';

const colors: string[] = ['#ff0000', '#00ff00', '#0000ff'];

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
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
      height: window.innerHeight * 0.41,
      type: 'pie',
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    },
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
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
    console.log('pie-init');
    console.log(this.chart);
    this.colors = this.settingsService.getColorDomain(this.data.length);
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          ...this.chartOptions.series[0],
          name: this.name,
          data: this.data,
          colors: this.colors,
          innerSize: this.innerSize,
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
        height: window.innerHeight * 0.41,
      },
    });
    this.chart.reflow();
    console.log(this.chart);
  }
}
