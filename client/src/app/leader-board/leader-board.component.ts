import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css'],
})
export class LeaderBoardComponent implements OnInit {
  data: any = { done: [], total: [], keys: [] };
  loading: boolean;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.getLeaderboard();
  }

  editData(data): void {
    const { done, total, keys } = _.reduce(
      data,
      (res, bucket) => {
        res.done = [...res.done, bucket.done];
        res.total = [...res.total, bucket.total - bucket.done]; // all tasks not done
        res.keys = [...res.keys, bucket.key];
        return res;
      },
      { done: [], total: [], keys: [] } as any
    );
    // const done = _.map(data, bucket => bucket.done);
    // const total = _.map(data, bucket => bucket.total); //TODO: substract done
    // const names = _.map(data, bucket => bucket.key);

    this.data = { done, total, keys };
  }

  getLeaderboard(): void {
    this.loading = true;
    this.taskService.getLeaderboard().subscribe(data => {
      this.loading = false;
      this.editData(data);
    });
  }

  getTask(event) {
    const userId = event.category.substring(
      event.category.lastIndexOf('\t') + 1,
      event.category.length
    );
    this.taskService.getTasksByFilter({ assign: userId });
  }
}
