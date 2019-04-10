import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NativeDateAdapter } from '@angular/material';
import { SettingsService } from '../_services/settings.service';
import { UserService } from '../_services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as _ from 'lodash';

export interface UserGroup {
  letter: string;
  names: string[];
}
function isFirstColumn(params) {
  var displayedColumns = params.columnApi.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  private user;
  private columnDefs;
  private defaultColDef;
  private rowSelection;
  private rowData: any[];
  private quickFilter: string = '';
  constructor(private http: HttpClient, private userService: UserService) {
    this.columnDefs = [
      {
        headerName: 'משתמש',
        field: 'name',
      },
      {
        headerName: 'מזהה משתמש',
        field: 'id',
      },
    ];
    this.defaultColDef = {
      width: 100,
      headerCheckboxSelection: isFirstColumn,
      checkboxSelection: isFirstColumn,
      resizable: true,
    };
    this.rowSelection = 'multiple';
  }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickFilter);
  }

  saveOffice() {
    console.log('inSaveOffice');
    const officeMemebersIDs = _.map(
      this.gridApi.getSelectedRows(),
      person => person.id
    );
    this.user.officeMembers = officeMemebersIDs; // selected members/users/persons
    this.userService
      .update(this.user)
      .subscribe(something => console.log('saved'));
  }

  onGridReady(params) {
    console.log('onGridReady');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    const user = this.user;
    // params.api.resetRowHeights();
    this.http
      .get('/api/hierarchy/getPersonsUnderPerson')
      .subscribe((data: any) => {
        console.log(data);
        this.rowData = data;
        setTimeout(() => {
          params.api.forEachNode(function(node) {
            node.setSelected(_.includes(user.officeMembers, node.data.id));
          });
        }, 0);
      });
  }
}
