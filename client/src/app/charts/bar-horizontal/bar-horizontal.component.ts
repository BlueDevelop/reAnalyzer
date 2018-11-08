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
    //domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886']
    // domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4']
    domain: ['#E9A951', '#CCA848', '#AFA746', '#93A349', '#799E50', '#609859', '#499163', '#35896B', '#278071', '#237675', '#296C75', '#336173', '#3D566C', '#454B63', '#4B4158', '#4D374B', '#4B2E3E', '#472631', '#411F25', '#38191A', '#2E1510']
  };

  onSelect(event) {
    console.log(event);
  }
}
