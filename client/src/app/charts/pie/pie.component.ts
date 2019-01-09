import { Component, OnInit, NgModule, Input } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
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
    console.log('data:');
    console.log(this.data);
    this.doughnut = this.doughnut || false;
  }

  onSelect(event) {
    console.log(event);
  }
  getTotal() {
    return _.sumBy(this.data, 'value');
  }
  getPrecentage(value) {
    const precentage = _.round((value / this.getTotal()) * 100);
    return `${precentage}%`;
  }
}
