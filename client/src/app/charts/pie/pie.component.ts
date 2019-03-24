import {
  Component,
  OnInit,
  NgModule,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SettingsService } from '../../_services/settings.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit, OnChanges {
  @Input()
  data: any[];
  @Input()
  legendTitle: any[];
  @Input()
  doughnut: boolean;

  view: any[] = [600, 400];

  // options
  showLegend = true;
  colorScheme = {};
  showLabels = true;
  explodeSlices = false;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.colorScheme = {
      domain: this.settingsService.getColorDomain(this.data.length),
    };
    //console.log('data:');
    //console.log(this.data);
    this.doughnut = this.doughnut || false;
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.colorScheme = {
      domain: this.settingsService.getColorDomain(this.data.length),
    };
  }

  onSelect(event) {
    //console.log(event);
  }
  getTotal() {
    return _.sumBy(this.data, 'value');
  }
  getPrecentage(value) {
    const precentage = _.round((value / this.getTotal()) * 100);
    return `אחוזים: ${precentage}%
    כמות: ${value}`;
  }
}
