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

  @ViewChild('discussionInput') discussionInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoDiscussion') autocompleteDiscussion: MatAutocomplete;

  @ViewChild('unitInput') unitInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoUnit') autocompleteUnit: MatAutocomplete;

  @ViewChild('projectInput') projectInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoProject') autocompleteProject: MatAutocomplete;

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;

  model: object;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  date = _moment().subtract(1, 'month');
  startDate = new FormControl(this.date);
  endDate = new FormControl(_moment());

  startDateTemp = this.date;
  endDateTemp = _moment();

  discussionSelected = new FormControl();
  unitSelected = new FormControl();
  projectSelected = new FormControl();

  filteredDiscussions: Observable<string[]>;
  filteredUnits: Observable<string[]>;
  filteredProjects: Observable<string[]>;

  discussions: string[] = [];
  allDiscussions: string[] = ['דיון 1', 'דיון מתוך פרויקט', 'דיון מתוך דיון מתוך משימה'];

  units: string[] = [];
  allUnits: string[] = ['גוגל', 'מיקרוסופט', 'לינובט', 'פייסבוק'];

  projects: string[] = [];
  allProjects: string[] = ['פרויקט 3', 'פרויקט מתוך פרויקט', 'פרויקט מתוך משימה ', 'פרויקט x'];

  constructor(private taskService: TaskService) {
    if (!this.taskService.filterParams.date.firstDay) {
      this.taskService.filterParams.date.firstDay = this.startDate.value.valueOf();
    }
    if (!this.taskService.filterParams.date.lastDay) {
      this.taskService.filterParams.date.lastDay = this.endDate.value.valueOf();

    }

  }

  //Filter for date
  dateFilter = (d): boolean => {
    return d.isSameOrAfter(this.startDate.value.valueOf());
  }

  //Filter for autocomplete
  private _filter(value: string, type: string): string[] {
    const filterValue = value.toLowerCase();
    return this.model[type].allItems.filter(option => option.toLowerCase().includes(filterValue));
  }

  //Update data after date range change 
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

    if (this.startDate.value.isAfter(this.endDate.value)) {
      this.endDate.setValue(this.startDate.value);
    }

    // if (this.taskService.firstDay != this.startDate.value.valueOf()) {
    //   this.taskService.firstDay = this.startDate.value.valueOf();
    //   if (this.taskService.firstDay > this.taskService.lastDay) {
    //     this.endDate.setValue(this.startDate.value);
    //     this.taskService.lastDay = this.taskService.firstDay;
    //   }
    // }
    // else if (this.taskService.lastDay != this.endDate.value.valueOf()) {
    //   this.taskService.lastDay = this.endDate.value.valueOf();
    // }

    // this.barDate.getFieldCountPerInterval();
    // this.pieStatus.getCountByStatus();
    // this.leaderBoard.getLeaderboard();
    // this.tagCloud.getTagClouds();
    // this.timeRates.getTimeRates();
  }

  ngOnInit() {
    this.model = {
      units: {
        autocompleteType: this.autocompleteUnit,
        items: this.units,
        itemSelected: this.unitSelected,
        itemInput: this.unitInput,
        filteredItems: this.filteredUnits,
        allItems: this.allUnits
      },
      discussions: {
        autocompleteType: this.autocompleteDiscussion,
        items: this.discussions,
        itemSelected: this.discussionSelected,
        itemInput: this.discussionInput,
        filteredItems: this.filteredDiscussions,
        allItems: this.allDiscussions
      },
      projects: {
        autocompleteType: this.autocompleteProject,
        items: this.projects,
        itemSelected: this.projectSelected,
        itemInput: this.projectInput,
        filteredItems: this.filteredProjects,
        allItems: this.allProjects
      }
    };

    //for (let type in this.model) {
    this.filteredUnits = this.model['units'].itemSelected.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit, 'units') : this.model['units'].allItems.slice()));

    this.filteredDiscussions = this.model['discussions'].itemSelected.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item, 'discussions') : this.model['discussions'].allItems.slice()));

    this.filteredProjects = this.model['projects'].itemSelected.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item, 'projects') : this.model['projects'].allItems.slice()));
    //}
  }

  add(event: MatChipInputEvent, model: string): void {
    // Add item only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.model[model].autocompleteType.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our item
      if ((value || '').trim()) {
        this.model[model].items.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.model[model].itemSelected.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, model: string): void {
    this.model[model].items.push(event.option.viewValue);
    this.model[model].itemInput.nativeElement.value = '';
    this.model[model].itemSelected.setValue(null);
  }

  remove(item: string, model: string): void {
    const index = this.model[model].items.indexOf(item);

    if (index >= 0) {
      this.model[model].items.splice(index, 1);
    }
  }

  dataFilering() {
    this.startDateTemp = this.startDate.value;
    this.endDateTemp = this.endDate.value;
    this.taskService.filterParams.discussions = [...this.discussions];
    this.taskService.filterParams.projects = [...this.projects];//JSON.parse(JSON.stringify(this.projects));
    this.taskService.filterParams.units = [...this.units];
    this.taskService.filterParams.date.firstDay = this.startDate.value.valueOf();
    this.taskService.filterParams.date.lastDay = this.endDate.value.valueOf();

    this.barDate.getFieldCountPerInterval();
    this.pieStatus.getCountByStatus();
    this.leaderBoard.getLeaderboard();
    this.tagCloud.getTagClouds();
    this.timeRates.getTimeRates();
  }

}
