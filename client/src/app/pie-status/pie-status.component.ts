import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ModalComponent } from '../modal/modal.component';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-pie-status',
  templateUrl: './pie-status.component.html',
  styleUrls: ['./pie-status.component.css'],
})
export class PieStatusComponent implements OnInit {
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
    let translateStatus: object;
    this.translate
      .get('status')
      .subscribe((res: object) => (translateStatus = res));
    this.data = _.map(data, bucket => {
      return {
        name: translateStatus[bucket.key],
        y: bucket.doc_count,
      };
    });
  }

  getCountByStatus(): void {
    this.empty = false;
    this.refresh.increaseProgress();
    this.taskService.getTaskCountByStatus().subscribe(data => {
      this.editData(data);
      this.empty = this.data.length == 0;
      this.refresh.decreaseProgress();
    });
  }

  getTask(event) {
    this.dialog.open(ModalComponent, {
      data: this.taskService.getTasksByFilter({ status: event.name }),
    });
  }
}
