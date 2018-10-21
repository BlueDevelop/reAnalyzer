import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar-horizontal',
  templateUrl: './bar-horizontal.component.html',
  styleUrls: ['./bar-horizontal.component.css']
})
export class BarHorizontalComponent implements OnInit {

  @Input() data: any[];
  @Input() legendTitle: any[];
  @Input() xAxisLabel: any[];
  @Input() yAxisLabel: any[];

  constructor() { }

  ngOnInit() {
  }
  single: any[];
  multi: any[];

  view: any[] = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showDataLabel = true;
  roundDomains = true;
  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886']
  };

  onSelect(event) {
    console.log(event);
  }
}
