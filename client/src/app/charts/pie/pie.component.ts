import { Component, OnInit, NgModule, Input } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  @Input() data: any[];
  @Input() legendTitle: any[];

  view: any[] = [600, 400];

  // options
  showLegend = true;
  colorScheme = {};
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.colorScheme = { domain: this.settingsService.getColorDomain(this.data.length) };
  }

  onSelect(event) {
    console.log(event);
  }
}
