import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  data;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getLeaderboard();
  }

  editData(data): void {
    this.data = _.map(data, (bucket) => {
      return {
        name: bucket.key,
        value: bucket.doc_count
      }
    })
  }

  getLeaderboard(): void {
    this.taskService.getLeaderboard()
      .subscribe(data => {
        this.editData(data);
      });
  }


}
