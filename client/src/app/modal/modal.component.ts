import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort, MatTableDataSource, MatTable } from '@angular/material';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from '../_services/excel.service';
import { AgGridAvatarComponent } from '../ag-grid-avatar/ag-grid-avatar.component';
import { AgGridStatusChipComponent } from '../ag-grid-status-chip/ag-grid-status-chip.component';
import { AgGridMaterialDatepickerComponent } from '../ag-grid-material-datepicker/ag-grid-material-datepicker.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  private style: any = {
    height: `${0.7 * window.innerHeight}px`,
    width: '100%',
  };
  private gridApi;
  private gridColumnApi;
  frameworkComponents = { agDateInput: AgGridMaterialDatepickerComponent };
  private localeText = {
    page: 'עמוד',
    more: 'עוד',
    to: 'עד',
    of: 'מתוך',
    next: 'הבא',
    last: 'האחרון',
    first: 'הראשון',
    previous: 'הקודם',
    selectAll: 'בחר הכל',
    equals: 'שווה ל',
    notEqual: 'שונה מ',
    lessThan: 'קטן מ',
    greaterThan: 'גדול מ',
    lessThanOrEqual: 'קטן או שווה ל',
    greaterThanOrEqual: 'גדול או שווה ל',
    inRange: 'בטווח',
    contains: 'מכיל',
    notContains: 'לא מכיל',
    startsWith: 'מתחיל ב',
    endsWith: 'נגמר ב',
    filters: 'פילטרים',
    export: 'ייצוא',
    csvExport: 'ייצוא לCSV',
  };
  displayedColumns: any[] = [
    {
      headerName: this.translate.instant('title'),
      field: 'title',
      sortable: true,
      // filter: true,
      resizable: true,
      cellStyle: { 'white-space': 'normal' },
      autoHeight: true,
    },
    {
      headerName: this.translate.instant('creator'),
      cellRendererFramework: AgGridAvatarComponent,
      field: 'creator',
      sortable: true,
      // filter: true,
    },
    {
      headerName: this.translate.instant('statusTask'),
      cellRendererFramework: AgGridStatusChipComponent,
      field: 'status',
      sortable: true,
      // filter: true,
      valueGetter: params => {
        // return this.translate.instant(`status.${params.data.status}`);
        return params.data.status;
      },
      valueFormatter: params => {
        return params.value.status;
      },
    },
    {
      headerName: this.translate.instant('assign'),
      field: 'assign',
      sortable: true,
      // filter: 'agTextColumnFilter',
      cellRendererFramework: AgGridAvatarComponent,
      valueGetter: function(params) {
        return params.data.assign.name;
      },
      valueFormatter: function(params) {
        return params.value;
      },
      filterValueGetter: function(params) {
        return params.data.assign.name;
      },
    },
    {
      headerName: this.translate.instant('watchers'),
      field: 'watchers',
      sortable: true,
      // filter: true,
      resizable: true,
      cellRendererFramework: AgGridAvatarComponent,
      cellStyle: { 'white-space': 'normal' },
      autoHeight: true,
      comparator: (a, b) => {
        let aLength = a.split(',').length;
        let bLength = b.split(',').length;
        return aLength >= bLength ? 1 : -1;
      },
      valueGetter: function(params) {
        return _.map(params.data.watchers, watcher => watcher.name).join(',');
      },
      // valueFormatter: function(params) {
      //   return _.map(params.value, watcher => watcher.name).join(',');
      // },

      filterValueGetter: function(params) {
        return _.map(params.data.watchers, watcher => watcher.name).join(',');
      },
    },
    {
      headerName: this.translate.instant('due'),
      field: 'due',
      sortable: true,
      // filter: 'agDateColumnFilter',
      resizable: true,
      // type: ['dateColumn'],
      // cellRenderer: data => {
      //   return moment(data.due).format('DD/MM/YYYY');
      // },
      comparator: (a, b) => {
        return !a ? -1 : !b ? 1 : a.diff(b) >= 0 ? 1 : -1;
      },
      valueGetter: function(params) {
        return !params.data.due
          ? undefined
          : moment.utc(params.data.due).local();
      },
      valueFormatter: function(params) {
        return !params.value ? '' : params.value.format('DD/MM/YYYY');
      },
      // filterValueGetter: function(params) {
      //   return !params.data.due ? '' : moment(params.data.due);
      // },
    },
  ];
  //dataArray = [this.data];
  dataSource: any; //= new MatTableDataSource(this.data as object[]);

  @ViewChild(MatTable)
  table: MatTable<any>;
  @ViewChild(MatSort)
  sort: MatSort;
  tableData: any[];
  loading: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>,
    private translate: TranslateService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.data.subscribe(data => {
      this.tableData = data;
      this.loading = false;
      if (this.gridApi) {
        this.gridApi.refreshCells();
        this.gridApi.sizeColumnsToFit();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.refreshCells();
  }
  onGridSizeChanged(params) {
    this.style = {
      height: `${0.7 * window.innerHeight}px`,
      width: '100%',
    };
    if (params.api) {
      // params.api.sizeColumnsToFit();
      params.api.resetRowHeights();
    }
  }
  save() {
    //TODO: add description in server and table + hide:true in table, and translate headers and status and check why watchers is not printed
    let excelJson = [];
    this.gridApi.forEachNode(function(rowNode, index) {
      //iterates over every row in the table and pushes the row to excelJson
      //should translate keys/status with translateService
      excelJson.push({
        ...rowNode.data,
        due: moment
          .utc(rowNode.data.due)
          .local()
          .toDate(),
      });
    });
    this.excelService.jsonToExcel(excelJson);
  }
  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
  }
}
