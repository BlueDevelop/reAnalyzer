import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import { ModalComponent } from '../modal/modal.component';
// import HC_exporting from 'highcharts/modules/exporting';
import wordcloud from 'highcharts/modules/wordcloud.src';
import { MatDialog } from '@angular/material';
wordcloud(Highcharts);
// HC_exporting(Highcharts);
// import {
//   CloudData,
//   CloudOptions,
//   ZoomOnHoverOptions,
// } from 'angular-tag-cloud-module';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.css'],
})
export class TagCloudComponent implements OnInit {
  chart: Highcharts.Chart;
  title = 'highchart-test';
  Highcharts = Highcharts;
  updateFlag = true;
  data: any[] = [];
  empty: boolean = false;
  colors: any[] = [];
  chartOptions = {
    chart: {
      backgroundColor: 'rgba(255,255,255,0.0)',
      height: '70%',
      animation: true,
    },
    series: [
      {
        style: { fontFamily: 'Alef', fontWeight: '900' },
        name: 'תדירות',
        type: 'wordcloud',
        // spiral: 'archimedean',
        placementStrategy: 'center',
        data: this.data,
        colors: this.colors,
        events: {
          click: e => console.log(e.point),
        },
        rotation: {
          from: 0,
          to: 0,
          orientations: 5,
        },
      },
    ],
    title: {
      text: '',
    },
    tooltip: {
      enabled: true,
      useHTML: true,
      headerFormat: '<small style="direction:rtl">{point.key}</small><br/>',
      pointFormat: '{series.name}: <b>{point.weight}</b>',
    },
  };

  constructor(
    private taskService: TaskService,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private refresh: RefreshService
  ) {}

  ngOnInit() {
    this.getTagClouds();
  }

  editData(data: any): void {
    const docCounts = _.map(data, bucket => bucket.doc_count);
    let uniqueCounts = _.uniq(docCounts).sort();
    this.colors = this.settingsService.getColorDomain(uniqueCounts.length);
    this.data = _.map(data, (bucket, index) => {
      return {
        name: bucket.key,
        weight: bucket.doc_count,
        color: this.colors[_.indexOf(uniqueCounts, bucket.doc_count)],
      };
    });
  }

  getTagClouds(): void {
    this.refresh.increaseProgress();
    this.empty = false;
    this.taskService.getTagClouds().subscribe(data => {
      this.editData(data);
      this.chartOptions = {
        ...this.chartOptions,
        series: [
          {
            style: { fontFamily: 'Alef', fontWeight: '900' },
            name: 'תדירות',
            type: 'wordcloud',
            // spiral: 'archimedean',
            placementStrategy: 'center',
            data: this.data,
            colors: this.colors,
            events: {
              click: e => this.getTasks(e.point.name),
            },
            rotation: {
              from: 0,
              to: 0,
              orientations: 5,
            },
          },
        ],
      };

      this.empty = this.data.length === 0;
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
}
