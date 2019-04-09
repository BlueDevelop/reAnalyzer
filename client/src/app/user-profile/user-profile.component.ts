import { Component, OnInit, ViewChild } from '@angular/core';
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

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('output')
  fileInput;
  avatarBase64: string;

  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];

  userForm: FormGroup = this.fb.group({
    userGroup: '',
  });

  userGroups: UserGroup[];
  usersGroupOptions: Observable<UserGroup[]>;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // this.usersGroupOptions = this.userForm.get('userGroup')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterGroup(value))
    // );
    // this.userService.getUser().subscribe(res => {
    //   this.fileInput.nativeElement.src = res.avatarImg;
    // });
    // this.getPersonsUnderPerson();
  }

  private _filterGroup(value: string): UserGroup[] {
    if (value) {
      return this.userGroups
        .map(group => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter(group => group.names.length > 0);
    }

    return this.userGroups;
  }

  openFile(event) {
    let input = event.target;

    let reader = new FileReader();

    reader.onload = () => {
      let dataURL = reader.result;
      this.avatarBase64 = dataURL as string;
      this.fileInput.nativeElement.src = dataURL;
    };

    reader.onprogress = data => {
      if (data.lengthComputable) {
        var progress = Math.round((data.loaded / data.total) * 100);
        //console.log(progress);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }

  saveAvatar() {
    this.userService.setUser({ avatarImg: this.avatarBase64 });
  }
  deleteAvatar() {
    this.userService.setUser({ avatarImg: undefined });
    this.avatarBase64 = undefined;
  }

  getPersonsUnderPerson() {
    this.userService.getPersonsUnderPerson().subscribe(data => {
      const groups = _.groupBy(data.persons, function(username) {
        return username[0];
      });
      this.userGroups = _.map(groups, usersArray => {
        return { letter: usersArray[0][0], names: usersArray };
      });
      console.dir(this.userGroups);
    });
  }
}
