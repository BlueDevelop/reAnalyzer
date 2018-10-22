import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import * as _moment from 'moment';

@Component({
  selector: 'app-chart-bar-date',
  templateUrl: './chart-bar-date.component.html',
  styleUrls: ['./chart-bar-date.component.css'],
})
export class ChartBarDateComponent implements OnInit {
  data;
  constructor(private taskService: TaskService) {}
  ngOnInit() {
    this.getFieldCountPerInterval();
  }

  editData(data): void {
    this.data = _.map(data, bucket => {
      return {
        //name: new Date(bucket.key).getDay() + "/" + new Date(bucket.key).getMonth() + "/" + new Date(bucket.key).getFullYear(),
        name: _moment(bucket.key).format('DD/MM/YYYY'),
        value: bucket.doc_count,
      };
    });
  }

  getFieldCountPerInterval(): void {
    this.taskService.getFieldCountPerInterval().subscribe(data => {
      this.editData(data);
    });
  }
}
