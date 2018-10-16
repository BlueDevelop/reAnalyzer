import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selected = 'option2';
  data;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    
  }

  // editData(data): void {
  //   this.data = _.map(data,(bucket)=>{
  //     return {
  //       name:bucket.key,
  //       value:bucket.doc_count
  //     }
  //   })
  // }

  // getCountByStatus(): void {
  //   this.taskService.getTaskCountByStatus()
  //     .subscribe(data => {
  //       this.editData(data);
  //     });
  // }

}
