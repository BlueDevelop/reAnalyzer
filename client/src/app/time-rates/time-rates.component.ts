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
    let interval: any = data.interval;
    let ratios = data.ratios;
    debugger;
    for (let i: number = 0; i < ratios.length; i++) {
      ratios[i] = { name: `${(interval * i)}%-${(interval * (i + 1))}%`, value: ratios[i] }
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
