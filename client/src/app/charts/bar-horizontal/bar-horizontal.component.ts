import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar-horizontal',
  templateUrl: './bar-horizontal.component.html',
  styleUrls: ['./bar-horizontal.component.css']
})
export class BarHorizontalComponent implements OnInit {

  @Input() data: any[];
  @Input() legendTitle: any[];
  
  constructor() { }

  ngOnInit() {
  }
  single: any[];
  multi: any[];

  view: any[] = [];

  // options
  showXAxis = false;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';
  roundDomains= 'true';
  colorScheme = {
    domain: ['#a8385d','#7aa3e5','#a27ea8','#aae3f5','#adcded','#a95963','#8796c0','#7ed3ed','#50abcc','#ad6886']
  };

  onSelect(event) {
    console.log(event);
  }
}
