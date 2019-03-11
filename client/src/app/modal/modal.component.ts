import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  dataSource = this.data;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object
  ) {}

  ngOnInit() {
    console.log(this.data);
  }
}
