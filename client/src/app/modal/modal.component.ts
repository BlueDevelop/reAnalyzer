import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'creator',
    'status',
    'assign',
    'watchers',
    'due',
  ];
  //dataArray = [this.data];
  dataSource = new MatTableDataSource(this.data as object[]);
  @ViewChild(MatSort)
  sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    console.log(this.data);
  }
}
