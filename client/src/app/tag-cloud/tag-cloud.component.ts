import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import { ModalComponent } from '../modal/modal.component';
// import HC_exporting from 'highcharts/modules/exporting';

import { MatDialog } from '@angular/material';

declare var require: any;
let wordcloud = require('highcharts/modules/wordcloud.src');
wordcloud(Highcharts);

import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.css'],
})
export class TagCloudComponent implements OnInit {
  @Input()
  title: string = '';
  chart: Highcharts.Chart;
  Highcharts = Highcharts;
  updateFlag = true;
  data: any = [];
  empty: boolean = false;
  colors: any[] = this.settingsService.getColorDomain(3);
  chartOptions = {
    chart: {
      backgroundColor: 'rgba(255,255,255,0.0)',
      height: window.innerHeight * 0.42,
      animation: true,
    },
    //colors: this.colors,
    plotOptions: {
      series: {
        events: {
          show: function() {
            var chart = this.chart,
              series = chart.series,
              i = series.length,
              otherSeries;
            while (i--) {
              otherSeries = series[i];
              if (otherSeries != this && otherSeries.visible) {
                otherSeries.hide();
              }
            }
          },
        },
      },
    },
    series: [
      {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: ' ',
        type: 'wordcloud',
        // // spiral: 'archimedean',
        placementStrategy: 'center',
        data: this.data,
        showInLegend: true,
        color: '#FF0000',
        events: {
          click: e => console.log(e.point),
        },
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
        visible: true,
      },
      {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: ' ',
        type: 'wordcloud',
        // // spiral: 'archimedean',
        placementStrategy: 'center',
        data: this.data,
        showInLegend: true,
        color: '#FF0000',
        events: {
          click: e => console.log(e.point),
        },
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
        visible: false,
      },
      {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: ' ',
        type: 'wordcloud',
        // // spiral: 'archimedean',
        placementStrategy: 'center',
        data: this.data,
        showInLegend: true,
        color: '#FF0000',
        events: {
          click: e => console.log(e.point),
        },
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
        visible: false,
      },
      {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: ' ',
        type: 'wordcloud',
        // // spiral: 'archimedean',
        placementStrategy: 'center',
        data: this.data,
        showInLegend: true,
        color: '#FF0000',
        events: {
          click: e => console.log(e.point),
        },
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
        visible: false,
      },
    ],
    title: {
      text: this.title,
    },
    tooltip: {
      enabled: true,
      useHTML: true,
      headerFormat: '',
      pointFormat: '<b>{point.numOfDelayed} / {point.weight}</b>',
    },
  };

  constructor(
    private taskService: TaskService,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private refresh: RefreshService
  ) {}

  ngOnInit() {
    this.chartOptions.title.text = this.title;
    this.getTagClouds();
  }

  editData(data: any): void {
    let dataGroup = _.groupBy(data, bucket => {
      if (bucket.percentage < 25) {
        return '<25%';
      } else if (bucket.percentage >= 25 && bucket.percentage < 50) {
        return '25%-50%';
      } else {
        return '>50%';
      }
    });
    if (dataGroup['<25%'])
      dataGroup['<25%'] = dataGroup['<25%'].map(bucket => {
        return {
          name: bucket.key,
          weight: bucket.doc_count,
          color: this.colors[0],
          numOfDelayed: Math.round(
            (bucket.percentage / 100) * bucket.doc_count
          ),
        };
      });
    if (dataGroup['25%-50%'])
      dataGroup['25%-50%'] = dataGroup['25%-50%'].map(bucket => {
        return {
          name: bucket.key,
          weight: bucket.doc_count,
          color: this.colors[1],
          numOfDelayed: Math.round(
            (bucket.percentage / 100) * bucket.doc_count
          ),
        };
      });
    if (dataGroup['>50%'])
      dataGroup['>50%'] = dataGroup['>50%'].map(bucket => {
        return {
          name: bucket.key,
          weight: bucket.doc_count,
          color: this.colors[2],
          numOfDelayed: Math.round(
            (bucket.percentage / 100) * bucket.doc_count
          ),
        };
      });
    let allData = data.map(bucket => {
      let color = '';
      if (bucket.percentage < 25) {
        color = this.colors[0];
      } else if (bucket.percentage >= 25 && bucket.percentage < 50) {
        color = this.colors[1];
      } else {
        color = this.colors[2];
      }
      return {
        name: bucket.key,
        weight: bucket.doc_count,
        color: color,
        numOfDelayed: Math.round((bucket.percentage / 100) * bucket.doc_count),
      };
    });
    dataGroup.all = allData;
    this.data = dataGroup;
  }

  getTagClouds(): void {
    this.refresh.increaseProgress();
    this.taskService.getTagClouds().subscribe(data => {
      this.editData(data);
      this.chartOptions = {
        ...this.chartOptions,
        series: this.generateSeries(),
      };
      this.empty = this.data.all.length === 0;
      this.refresh.decreaseProgress();
    });
  }
  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  onClickTag(tagClicked) {
    console.log(tagClicked);
  }
  getTasks(name: string) {
    this.dialog.open(ModalComponent, {
      data: this.taskService.getTasksByFilter({ tag: name }),
    });
  }
  onResize() {
    // this.tagCloudComponent.reDraw();
    this.chart.update({
      chart: {
        height: window.innerHeight * 0.42,
      },
    });
    this.chart.reflow();
  }
  generateSeries() {
    return _.map(this.data, (series, i) => {
      return {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: i == 'all' ? 'הכל' : i,
        type: 'wordcloud',
        // // spiral: 'archimedean',
        placementStrategy: 'center',
        data: series,
        showInLegend: true,
        events: {
          click: e => this.getTasks(e.point.name),
        },
        color: '#FF0000',
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
        visible: i == 'all' ? true : false,
      };
    });
  }
}
