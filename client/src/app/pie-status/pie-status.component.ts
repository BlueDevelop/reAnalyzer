import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-pie-status',
  templateUrl: './pie-status.component.html',
  styleUrls: ['./pie-status.component.css']
})
export class PieStatusComponent implements OnInit {
  data;
  loading: boolean;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getCountByStatus();
  }

  editData(data): void {
    this.data = _.map(data, (bucket) => {
      return {
        name: bucket.key,
        value: bucket.doc_count
      }
    })
  }

  getCountByStatus(): void {
    this.loading = true;
    this.taskService.getTaskCountByStatus()
      .subscribe(data => {
        this.loading = false;
        this.editData(data);
      });
  }
}
