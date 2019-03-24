import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';
import * as moment from 'moment';

const WEEK_INTERVAL = 1;

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit, OnChanges {
  @Input()
  data: any[];
  @Input()
  legendTitle: any[];
  @Input()
  xAxisLabel: any[];
  @Input()
  yAxisLabel: any[];
  @Input()
  view: any[];
  @Input()
  xAxisTickFormatting: any;
  @Input()
  interval: any;

  intervals: string[] = ['1d', '1w', '1m', '1y'];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    //this.colorScheme = { domain: this.settingsService.getColorDomain(this.data.length) };
  }

  ngOnChanges() {
    this.colorScheme = {
      domain: this.settingsService.getColorDomain(this.data.length),
    };
  }

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showDataLabel = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  roundDomains = 'true';
  colorScheme = {};

  onSelect(event) {
    //console.log(event);
  }
  generateTooltipString(model: any): string {
    const date = moment(model.name);
    switch (this.intervals[this.interval]) {
      case '1d': {
        return date.format('DD/MM/YYYY');
      }
      case '1w': {
        const sunday = date.clone().day('Sunday');
        const nextSunday = sunday.clone().add(7, 'days');
        return `${sunday.format('DD/MM/YYYY')}-${nextSunday.format(
          'DD/MM/YYYY'
        )}`;
      }
      case '1m': {
        return `${date.month() + 1}/${date.year()}`;
      }
      case '1y': {
        return `${date.year()}`;
      }
    }
  }
}
