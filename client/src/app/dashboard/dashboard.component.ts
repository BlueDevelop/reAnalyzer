import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selected = 'option2';
  // data= [
  //   {
  //     "name": "Germany",
  //     "value": 40632
  //   },
  //   {
  //     "name": "United States",
  //     "value": 49737
  //   },
  //   {
  //     "name": "France",
  //     "value": 36745
  //   },
  //   {
  //     "name": "United Kingdom",
  //     "value": 36240
  //   },
  //   {
  //     "name": "Spain",
  //     "value": 33000
  //   },
  //   {
  //     "name": "Italy",
  //     "value": 35800
  //   }
  // ]
  data
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getCountByStatus()
  }

  editData(data): void {
    debugger
    // let temp = data.aggregations[2].buckets;
    // this.data = _.map(temp,(bucket)=>{
    //   return {
    //     name:bucket&&bucket.key,
    //     value:bucket&&bucket.doc_count
    //   }
    // })
  }

  getCountByStatus(): void {
    debugger
    this.taskService.getTaskCountByStatus()
      .subscribe(data => {
        this.editData(data);
      });
  }

}
