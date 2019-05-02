import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}
  public async aoaToExcel(data: any) {
    const filename = new Date().toDateString() + '.xlsx';
    // data = [[1, 2, 3], ['a', true, new Date()]];
    const ws_name = 'Excel Export';
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }
  public async jsonToExcel(data: any) {
    const filename = new Date().toDateString() + '.xlsx';
    const ws_name = 'Excel Export';
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  }
}
