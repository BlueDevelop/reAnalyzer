import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ModalComponent } from '../modal/modal.component';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-my-given-task',
  templateUrl: './my-given-task.component.html',
  styleUrls: ['./my-given-task.component.css'],
})
export class MyGivenTaskComponent implements OnInit {
  data: object[] = [];
  empty: boolean = false;
  @Input()
  title: string = '';

  constructor(
    private taskService: TaskService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private refresh: RefreshService
  ) {}

  ngOnInit() {
    this.getCountByStatus();
  }

  editData(data): void {
    this.data = _.map(data, bucket => {
      let name: object;
      this.translate.get(bucket.key).subscribe((res: object) => (name = res));
      return {
        name: name,
        y: bucket.doc_count,
      };
    });
  }

  getCountByStatus(): void {
    this.empty = false;
    this.refresh.increaseProgress();
    this.taskService.getOpenTasks(true, false).subscribe(data => {
      this.editData(data);
      this.empty = this.data[0]['y'] == 0 && this.data[0]['y'] == 0;
      this.refresh.decreaseProgress();
    });
  }

  getTask(event) {
    let open: boolean = event.name == 'באיחור' ? true : false;
    this.dialog.open(ModalComponent, {
      data: this.taskService.getMyTasks({
        officeCreated: true,
        officeAssign: false,
        open: open,
      }),
    });
  }
}
