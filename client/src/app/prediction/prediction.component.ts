import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css'],
})
export class PredictionComponent implements OnInit {
  constructor() {}

  dataFilering() {
    console.log(
      'Hi i am filtering very good my name is filter why are you gay?'
    );
  }

  ngOnInit() {}
}
