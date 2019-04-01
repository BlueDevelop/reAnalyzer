import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ag-grid-status-chip',
  templateUrl: './ag-grid-status-chip.component.html',
  styleUrls: ['./ag-grid-status-chip.component.css'],
})
export class AgGridStatusChipComponent implements ICellRendererAngularComp {
  constructor(private translate: TranslateService) {}
  public status: string = '';
  public colorMapping = {
    new: '#ff4081',
    done: '#757575',
    'in-progress': '#f69679',
    rejected: '#ef5350',
    assigned: '#2979ff',
    review: '#8dc63f',
    // 'waiting-approval': 'gray',
  };
  public params: any = {
    value: { status: '' },
  };
  agInit(params: any): void {
    this.params = params;
    this.status = params.value;
    // console.log(params);
  }

  refresh(): boolean {
    return false;
  }
}
