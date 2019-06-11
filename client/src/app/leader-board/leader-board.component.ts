import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ModalComponent } from '../modal/modal.component';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css'],
})
export class LeaderBoardComponent implements OnInit {
  data: any = { done: [], total: [], keys: [] };

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    private refresh: RefreshService
  ) {}

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
    this.refresh.increaseProgress();
    this.taskService.getLeaderboard().subscribe(data => {
      // data = [
      //   {
      //     key: 'aaa',
      //     done: 4,
      //     total: 9,
      //   },
      //   {
      //     key: 'bbb',
      //     done: 5,
      //     total: 10,
      //   },
      //   {
      //     key: 'ccc',
      //     done: 6,
      //     total: 7,
      //   },
      //   {
      //     key: 'ddd',
      //     done: 10,
      //     total: 13,
      //   },
      // ];
      this.editData(data);

      this.refresh.decreaseProgress();
    });
  }

  getTask(event) {
    const userId = event.category.substring(
      event.category.lastIndexOf('\t') + 1,
      event.category.length
    );

    this.dialog.open(ModalComponent, {
      data: this.taskService.getTasksByFilter({ 'assign.id': userId }),
    });
  }

  // openDialog(data): void {
  //   this.dialog.open(ModalComponent, { data: data });
  // }
}
