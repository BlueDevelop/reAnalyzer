import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  @Input() data: any[];
  @Input() legendTitle: any[];
  @Input() xAxisLabel: any[];
  @Input() yAxisLabel: any[];
  @Input() view: any[];

  constructor() { }

  ngOnInit() {
  }

  single: any[];
  multi: any[];

  //view: any[] = [undefined, undefined];

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
    domain: ['#E9A951', '#CCA848', '#AFA746', '#93A349', '#799E50', '#609859', '#499163', '#35896B', '#278071', '#237675', '#296C75', '#336173', '#3D566C', '#454B63', '#4B4158', '#4D374B', '#4B2E3E', '#472631', '#411F25', '#38191A', '#2E1510']
    // domain: ['#5D8AA8', '#346382', '#17405C', '#062235', '#91B6CE', '#D1E6F4']
    //domain: ['#01579B', '#0277BD', '#0288D1', '#039BE5', '#03A9F4', '#29B6F6', '#4FC3F7', '#81D4FA', '#B3E5FC', '#E1F5FE']
  };

  // '#11222D', '#1B3542', '#234858', '#2A5D6F', '#317386', '#368A9E', '#3AA1B5', '#3DB9CC', '#40D2E3', '#41ECFA'
  //'#252C3C','#2D3346','#363B50','#3F435B','#494A65','#535270','#5E5A7B','#696286','#756A91','#81729B','#8E7AA6','#9B82B1'
  // '#E9A951','#CCA848','#AFA746','#93A349','#799E50','#609859','#499163','#35896B','#278071','#237675','#296C75','#336173','#3D566C','#454B63','#4B4158','#4D374B','#4B2E3E','#472631','#411F25','#38191A','#2E1510'
  onSelect(event) {
    console.log(event);
  }
}
