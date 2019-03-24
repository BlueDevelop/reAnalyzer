import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ICellEditorParams } from 'ag-grid-community';
import { AgEditorComponent } from 'ag-grid-angular';
import { MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-ag-grid-material-datepicker',
  templateUrl: './ag-grid-material-datepicker.component.html',
  styleUrls: ['./ag-grid-material-datepicker.component.css'],
})
export class AgGridMaterialDatepickerComponent {
  columnWidth: string;
  params: ICellEditorParams;
  private value: string;
  @ViewChild('picker', { read: MatDatepicker })
  picker: MatDatepicker<Date>;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.picker.open();
  }

  isPopup(): boolean {
    return false;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  isCancelAfterEnd(): boolean {
    return false;
  }

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
  }

  getValue(): string {
    return this.value;
  }
  // setDate(date: Date): void {
  //   this.value = date.toDateString() || null;
  //   // this.picker.setDate(date);
  // }

  onSelectChange(e): void {
    setTimeout(
      function() {
        this.params.stopEditing();
      }.bind(this)
    );
  }
}
