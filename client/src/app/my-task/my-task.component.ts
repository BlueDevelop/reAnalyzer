import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ModalComponent } from '../modal/modal.component';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css'],
})
export class MyTaskComponent implements OnInit {
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
    this.taskService.getOpenTasks(false, true).subscribe(data => {
      this.editData(data);
      this.empty = this.data[0]['y'] == 0 && this.data[0]['y'] == 0;
      this.refresh.decreaseProgress();
    });
  }

  getTask(event) {
    let open: boolean = event.name == 'באיחור' ? true : false;
    this.dialog.open(ModalComponent, {
      data: this.taskService.getMyTasks({
        officeCreated: false,
        officeAssign: true,
        open: open,
      }),
    });
  }
}
