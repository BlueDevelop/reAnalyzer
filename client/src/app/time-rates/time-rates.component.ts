import { Component, OnInit } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import { SettingsService } from '../_services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-time-rates',
  templateUrl: './time-rates.component.html',
  styleUrls: ['./time-rates.component.css'],
})
export class TimeRatesComponent implements OnInit {
  data: object[] = [];
  loading: boolean;
  constructor(
    private taskService: TaskService,
    private settingsService: SettingsService,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTimeRates();
  }

  getTimeRates(): void {
    this.loading = true;
    this.taskService.getTimeRates().subscribe(data => {
      this.loading = false;
      this.data = _.map(data.ratios, ratio => {
        return { name: ratio.name, y: ratio.value };
      });
    });
  }

  getTask(event) {
    console.log('time rates component event');
    console.log(event);
    const name = event.name;
    let ratioMin, ratioMax;
    if (name.indexOf('-') > -1) {
      ratioMin = parseInt(name.substring(0, name.indexOf('%'))) / 100;
      ratioMax =
        parseInt(name.substring(name.indexOf('-') + 1, name.length)) / 100;
    } else {
      ratioMin = 10;
      ratioMax = -1;
    }

    console.log(`ratioMin:${ratioMin} , ratioMax:${ratioMax}`);
    this.dialog.open(ModalComponent, {
      data: this.taskService.getTasksByFilter({
        ratioMin: ratioMin,
        ratioMax: ratioMax,
      }),
    });
  }
}
