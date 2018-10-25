import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-time-rates',
  templateUrl: './time-rates.component.html',
  styleUrls: ['./time-rates.component.css']
})
export class TimeRatesComponent implements OnInit {
  data: any;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getTimeRates();
  }


  editData(data): void {
    debugger;
    let interval: any = data.interval;
    let ratios = data.ratios;
    // this.data = _.map(data, (bucket) => {
    //   return {
    //     name: bucket.key,
    //     value: bucket.doc_count
    //   }
    // })
    //ratios.map((bucket, index) => { return { name: interval * index, value: bucket } });
    for (let i: number = 0; i < ratios.length; i++) {
      ratios[i] = { name: `${(interval * i)}%`, value: ratios[i] }
    }
    return ratios;
  }

  getTimeRates(): void {
    this.taskService.getTimeRates()
      .subscribe(data => {
        this.data = this.editData(data);
      });
  }

}
