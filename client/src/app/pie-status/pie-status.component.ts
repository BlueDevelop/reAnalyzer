import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-pie-status',
  templateUrl: './pie-status.component.html',
  styleUrls: ['./pie-status.component.css'],
})
export class PieStatusComponent implements OnInit {
  data: object[] = [];
  loading: boolean;

  constructor(
    private taskService: TaskService,
    private translate: TranslateService
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
    this.loading = true;
    this.taskService.getTaskCountByStatus().subscribe(data => {
      this.loading = false;
      this.editData(data);
    });
  }
}
