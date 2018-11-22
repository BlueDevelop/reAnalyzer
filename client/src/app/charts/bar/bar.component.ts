import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SettingsService } from '../../_services/settings.service'
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() legendTitle: any[];
  @Input() xAxisLabel: any[];
  @Input() yAxisLabel: any[];
  @Input() view: any[];

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    //this.colorScheme = { domain: this.settingsService.getColorDomain(this.data.length) };
  }

  ngOnChanges() {
    this.colorScheme = { domain: this.settingsService.getColorDomain(this.data.length) };
  }

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showDataLabel = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  roundDomains = 'true';
  colorScheme = {};

  onSelect(event) {
    console.log(event);
  }
}
