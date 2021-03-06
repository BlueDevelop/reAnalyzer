import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { SettingsService } from '../_services/settings.service';
import * as _ from 'lodash';
import {
  CloudData,
  CloudOptions,
  ZoomOnHoverOptions,
} from 'angular-tag-cloud-module';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.css'],
})
export class TagCloudComponent implements OnInit {
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
    width: 1200,
    height: 700,
    overflow: false,
  };

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 1.2, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
    delay: 0.4, // Zoom will take affect after 0.8 seconds
  };

  data: CloudData[] = [];
  loading: boolean;
  constructor(private taskService: TaskService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.getTagClouds();
  }

  editData(data: any): void {
    const docCounts = _.map(data, (bucket => bucket.doc_count));
    let uniqueCounts = _.uniq(docCounts).sort();
    let colors = this.settingsService.getColorDomain(uniqueCounts.length);
    this.data = _.map(data, (bucket, index) => {
      return {
        text: bucket.key,
        weight: bucket.doc_count,
        color: colors[_.indexOf(uniqueCounts, bucket.doc_count)]
      }
    });
  }

  getTagClouds(): void {
    this.loading = true;
    this.taskService.getTagClouds()
      .subscribe(data => {
        this.loading = false;
        this.editData(data);
      });
  }

  onClickTag(tagClicked: CloudData) {
    console.log(tagClicked);
  }
}
