import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import * as _moment from 'moment';

@Component({
  selector: 'app-chart-bar-date',
  templateUrl: './chart-bar-date.component.html',
  styleUrls: ['./chart-bar-date.component.css'],
})
export class ChartBarDateComponent implements OnInit {
  data: object[] = [];
  loading: boolean;

  intervals: string[] = ['1d', '1w', '1m', '1y'];
  autoTicks = true;
  disabled = false;
  invert = false;
  max = 3;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  interval = 0;
  vertical = true;


  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.getFieldCountPerInterval(this.intervals[this.interval]);
  }

  changeInterval() {
    this.getFieldCountPerInterval(this.intervals[this.interval]);
  }

  formatLabel(ind: number | null) {
    const values = ['יום', 'שבוע', 'חודש', 'שנה'];
    return values[ind];
  }

  editData(data): void {
    this.data = _.map(data, (bucket) => {
      return {
        name: _moment(bucket.key).format("DD/MM/YYYY"),
        value: bucket.doc_count
      }
    })
  }

  getFieldCountPerInterval(interval: string = '1d'): void {
    this.loading = true;
    this.taskService.getFieldCountPerInterval(interval).subscribe(data => {

      //Move slide to correct position
      this.interval = this.intervals.indexOf(interval);

      this.loading = false;
      this.editData(data);
    });
  }
}
