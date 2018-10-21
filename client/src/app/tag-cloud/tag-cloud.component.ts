import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import { CloudData, CloudOptions, ZoomOnHoverOptions } from 'angular-tag-cloud-module';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.css']
})
export class TagCloudComponent implements OnInit {
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value 
    width : 1200,
    height : 700,
    overflow: false,
  };

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.3, // Elements will become 130 % of current zize on hover
    transitionTime: 1.2, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
    delay: 0.4 // Zoom will take affect after 0.8 seconds
  };
  
  data: CloudData[] = [];
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getTagClouds();
  }

  editData(data): void {
    debugger
    this.data = _.map(data,(bucket)=>{
      return {
        text:bucket.key,
        weight:bucket.doc_count
      }
    })
  }

  getTagClouds(): void {
    debugger
    this.taskService.getTagClouds()
      .subscribe(data => {
        this.editData(data);
      });
  }
}
