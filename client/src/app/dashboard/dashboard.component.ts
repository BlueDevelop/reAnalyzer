import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../_services/task.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class DashboardComponent implements OnInit {
  @ViewChild('barDate') barDate;
  @ViewChild('pieStatus') pieStatus;
  @ViewChild('leaderBoard') leaderBoard;
  @ViewChild('tagCloud') tagCloud;
  @ViewChild('timeRates') timeRates;

  //selected = 'option2';

  events: string[] = [];
  date = _moment().subtract(1, 'month');
  startDate = new FormControl(this.date);
  endDate = new FormControl(_moment());

  discussionSelected = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoDiscussion') matAutocomplete: MatAutocomplete;


  myFilter = (d): boolean => {
    return d.isAfter(this.startDate.value.valueOf());
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(option => option.toLowerCase().includes(filterValue));
  }

  constructor(private taskService: TaskService) {
    this.taskService.firstDay = this.startDate.value.valueOf();
    this.taskService.lastDay = this.endDate.value.valueOf();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (this.taskService.firstDay != this.startDate.value.valueOf()) {
      this.taskService.firstDay = this.startDate.value.valueOf();
      if (this.taskService.firstDay > this.taskService.lastDay) {
        this.endDate.setValue(this.startDate.value);
        this.taskService.lastDay = this.taskService.firstDay;
      }
    }
    else if (this.taskService.lastDay != this.endDate.value.valueOf()) {
      this.taskService.lastDay = this.endDate.value.valueOf();
    }

    this.barDate.getFieldCountPerInterval();
    this.pieStatus.getCountByStatus();
    this.leaderBoard.getLeaderboard();
    this.tagCloud.getTagClouds();
    this.timeRates.getTimeRates();
  }

  ngOnInit() {
    // this.filteredOptions = this.discussionSelected.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
    this.filteredFruits = this.discussionSelected.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.fruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.discussionSelected.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.discussionSelected.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

}
