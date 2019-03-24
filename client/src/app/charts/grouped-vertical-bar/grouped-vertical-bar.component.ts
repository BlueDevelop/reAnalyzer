import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grouped-vertical-bar',
  templateUrl: './grouped-vertical-bar.component.html',
  styleUrls: ['./grouped-vertical-bar.component.css']
})
export class GroupedVerticalBarComponent implements OnInit {
  chart = {
    view: undefined,
    colorScheme: { domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4'] },
    schemeType: 'ordinal',
    showLegend: true,
    legendTitle: 'Legend',
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    yAxisLabel: '',
    xAxisLabel: '',
    autoScale: true,
    showGridLines: true,
    rangeFillOpacity: 0.5,
    roundDomains: false,
    tooltipDisabled: false,
    showSeriesOnHover: true,
    // curve: shape.curveLinear,
    // curveClosed: shape.curveCardinalClosed
  };

  data = [
    {
      "name": "לא מעניין",
      "series": [
        {
          "name": "0%",
          "value": 40
        }
      ]
    },
    {
      "name": "עמדו במשימה",
      "series": [
        {
          "name": "0-25%",
          "value": 24
        },
        {
          "name": "25-50%",
          "value": 545
        },
        {
          "name": "50-75%",
          "value": 13
        },
        {
          "name": "75-100%",
          "value": 86
        }
      ]
    },
    {
      "name": "100-1000%",
      "series": [
        {
          "name": "100-250%",
          "value": 46
        },
        {
          "name": "250-500%",
          "value": 543
        },
        {
          "name": "500-750%",
          "value": 23
        },
        {
          "name": "750-1000%",
          "value": 52
        }
      ]
    },
    {
      "name": "לוזרים",
      "series": [
        {
          "name": "1000-@@$$@%",
          "value": 654
        }
      ]
    }
  ]
  //@Input() data: any[];
  // @Input() legendTitle: any[];
  // @Input() xAxisLabel: any[];
  // @Input() yAxisLabel: any[];

  constructor() { }

  ngOnInit() {

  }

  single: any[];
  multi: any[];

  view: any[] = [undefined, undefined];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showDataLabel = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  roundDomains = true;
  colorScheme = {
    //domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886']
    //domain: ['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']
    domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4']
    //domain: ['#01579B', '#0277BD', '#0288D1', '#039BE5', '#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE']
  };



  onSelect(event) {
    //console.log(event);
  }
}
