import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { TaskService } from '../_services/task.service';
import { FilterService } from '../_services/filter.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatAutocomplete,
} from '@angular/material';
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
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FilterComponent implements OnInit {
  @Output('valueChange')
  valueChange = new EventEmitter<any>();

  @ViewChild('discussionInput')
  discussionInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoDiscussion')
  autocompleteDiscussion: MatAutocomplete;

  @ViewChild('unitInput')
  unitInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoUnit')
  autocompleteUnit: MatAutocomplete;

  @ViewChild('projectInput')
  projectInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoProject')
  autocompleteProject: MatAutocomplete;

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
  allDiscussions: object[] = [];

  units: object[] = [];
  allUnits: object[] = [];

  projects: string[] = [];
  allProjects: string[] = [];

  constructor(
    private taskService: TaskService,
    private filterService: FilterService
  ) {
    if (!this.filterService.filterParams.date.firstDay) {
      this.filterService.filterParams.date.firstDay = this.startDate.value.valueOf();
    }
    if (!this.filterService.filterParams.date.lastDay) {
      this.filterService.filterParams.date.lastDay = this.endDate.value.valueOf();
    }
  }

  //Filter for date
  dateFilter = (d): boolean => {
    return d.isSameOrAfter(this.startDate.value.valueOf());
  };

  //Filter for autocomplete
  private _filter(value: string, type: string): string[] {
    const filterValue = value.toLowerCase();
    return this.model[type].allItems.filter(option =>
      option.value.toLowerCase().includes(filterValue)
    );
  }

  //Update data after date range change
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if (this.startDate.value.isAfter(this.endDate.value)) {
      this.endDate.setValue(this.startDate.value);
    }
  }

  filterInitiazlizer(
    entity: string,
    filterServiceListFunctionName: string,
    filteredEntity: string
  ) {
    this.filterService[filterServiceListFunctionName]().subscribe(data => {
      this.model[entity].allItems = data;
      this[filteredEntity] = this.model[entity].itemSelected.valueChanges.pipe(
        startWith(null),
        map(
          (filterQuery: string | null) =>
            filterQuery
              ? this._filter(filterQuery, entity)
              : this.model[entity].allItems.map(item => {
                  return { ...item };
                })
        )
      );
    });
  }

  ngOnInit() {
    this.model = {
      units: {
        autocompleteType: this.autocompleteUnit,
        items: this.units,
        itemSelected: this.unitSelected,
        itemInput: this.unitInput,
        filteredItems: this.filteredUnits,
        allItems: this.allUnits,
      },
      discussions: {
        autocompleteType: this.autocompleteDiscussion,
        items: this.discussions,
        itemSelected: this.discussionSelected,
        itemInput: this.discussionInput,
        filteredItems: this.filteredDiscussions,
        allItems: this.allDiscussions,
      },
      projects: {
        autocompleteType: this.autocompleteProject,
        items: this.projects,
        itemSelected: this.projectSelected,
        itemInput: this.projectInput,
        filteredItems: this.filteredProjects,
        allItems: this.allProjects,
      },
    };
    this.filterInitiazlizer(
      'projects',
      'getProjectNameList',
      'filteredProjects'
    );
    this.filterInitiazlizer('units', 'getUnitNameList', 'filteredUnits');
    this.filterInitiazlizer(
      'discussions',
      'getDiscussionNameList',
      'filteredDiscussions'
    );
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
    this.filterService.filterParams.discussions = [...this.discussions];
    this.filterService.filterParams.projects = [...this.projects];
    this.filterService.filterParams.units = [...this.units];
    this.filterService.filterParams.date.firstDay = this.startDate.value.valueOf();
    this.filterService.filterParams.date.lastDay = this.endDate.value.valueOf();
    console.log('child1');
    this.valueChange.emit();
  }
}
