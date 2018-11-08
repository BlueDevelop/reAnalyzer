import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grouped-vertical-bar',
  templateUrl: './grouped-vertical-bar.component.html',
  styleUrls: ['./grouped-vertical-bar.component.css']
})
export class GroupedVerticalBarComponent implements OnInit {
  data = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    }
  ]
  //@Input() data: any[];
  @Input() legendTitle: any[];
  @Input() xAxisLabel: any[];
  @Input() yAxisLabel: any[];
  constructor() { }

  ngOnInit() {
  }

  single: any[];
  multi: any[];

  view: any[] = [1200, undefined];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showDataLabel = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  roundDomains = 'true';
  colorScheme = {
    //domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886']
    //domain: ['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']
    domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4']
    //domain: ['#01579B', '#0277BD', '#0288D1', '#039BE5', '#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE']
  };



  onSelect(event) {
    console.log(event);
  }
}
