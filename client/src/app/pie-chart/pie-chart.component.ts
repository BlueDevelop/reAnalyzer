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

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input()
  data: any[];
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
  constructor(private settingsService: SettingsService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }

  ngOnInit() {
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
    console.log(this.chart);
  }
}
