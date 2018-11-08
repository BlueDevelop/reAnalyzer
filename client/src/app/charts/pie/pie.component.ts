import { Component, OnInit, NgModule, Input } from '@angular/core';

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

  colorScheme = {
    //domain: ['#a8385d','#7aa3e5','#a27ea8','#aae3f5','#adcded','#a95963','#8796c0','#7ed3ed','#50abcc','#ad6886']
    // domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4']
    domain: ['#E9A951', '#609859', '#296C75', '#4D374B', '#2E1510']

  };

  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  constructor() { }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
  }

}
