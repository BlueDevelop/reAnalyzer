import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-bar-date',
  templateUrl: './chart-bar-date.component.html',
  styleUrls: ['./chart-bar-date.component.css']
})
export class ChartBarDateComponent implements OnInit {
  data= [
    {
      "name": "Germany",
      "value": 40632
    },
    {
      "name": "United States",
      "value": 49737
    },
    {
      "name": "France",
      "value": 36745
    },
    {
      "name": "United Kingdom",
      "value": 36240
    },
    {
      "name": "Spain",
      "value": 33000
    },
    {
      "name": "Italy",
      "value": 35800
    }
  ]
  constructor() {
    
  }
  ngOnInit() {
  }

}
