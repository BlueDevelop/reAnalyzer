import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';

@Component({
  selector: 'app-bar-horizontal',
  templateUrl: './bar-horizontal.component.html',
  styleUrls: ['./bar-horizontal.component.css'],
})
export class BarHorizontalComponent implements OnInit {
  @Input()
  data: any[];
  @Input()
  legendTitle: any[];
  @Input()
  xAxisLabel: any[];
  @Input()
  yAxisLabel: any[];

  view: any[] = [];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.colorScheme = {
      domain: this.settingsService.getColorDomain(this.data.length),
    };
  }

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showDataLabel = true;
  roundDomains = true;
  colorScheme = {};

  onSelect(event) {
    console.log(event);
  }
}
