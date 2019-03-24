import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ag-grid-avatar',
  templateUrl: './ag-grid-avatar.component.html',
  styleUrls: ['./ag-grid-avatar.component.css'],
})
export class AgGridAvatarComponent implements ICellRendererAngularComp {
  constructor(private translate: TranslateService) {}

  public params: any = {
    value: { watchers: [] },
  };
  public watchers: any[] = [];
  agInit(params: any): void {
    this.params = params;
    this.watchers = params.value.split(',');
    // console.log(params);
  }

  refresh(): boolean {
    return false;
  }
}
