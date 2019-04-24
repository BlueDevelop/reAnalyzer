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
  public selectedUsers: any[] = [];
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

    this.rowSelection = 'multiple';
  }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
    this.defaultColDef = {
      width: 20,
      headerCheckboxSelection: isFirstColumn,
      checkboxSelection: isFirstColumn,
      resizable: true,
    };
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.quickFilter);
  }

  getSelecedUserRow(user) {
    this.gridApi.ensureNodeVisible(user, 'top');
  }

  saveOffice() {
    const officeMemebersIDs = _.map(
      this.gridApi.getSelectedRows(),
      person => person.id
    );
    this.user.officeMembers = officeMemebersIDs; // selected members/users/persons
    this.userService.update(this.user).subscribe(something => {
      this.selectedUsers = this.gridApi.getSelectedRows();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    const user = this.user;
    const selectedUsers = this.selectedUsers;

    // params.api.resetRowHeights();
    this.http
      .get('/api/hierarchy/getPersonsUnderPerson')
      .subscribe((data: any) => {
        this.rowData = data;
        setTimeout(() => {
          params.api.forEachNode(function(node) {
            const predicate: boolean = _.includes(
              user.officeMembers,
              node.data.id
            );
            node.setSelected(predicate);
            if (predicate) selectedUsers.push(node.data);
          });
        }, 0);
      });
  }
}
