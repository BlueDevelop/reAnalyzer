import { Injectable } from '@angular/core';
import * as _chroma from 'chroma-js';
import { UserService } from './user.service';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public interval: string = 'without';
  colorsArrayDefault: string[] = [
    '#E0F7FA',
    '#B1EBF2',
    '#7EDEEA',
    '#48D0E1',
    '#1AC6DA',
    '#00BBD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064',
  ];
  public colorsArrayBS = new BehaviorSubject<string[]>(this.colorsArrayDefault);
  colorsArray: string[];
  avatarImg: string = '';

  constructor(private usersService: UserService) {
    this.initColorsArray().subscribe(ret => {
      if (this.colorsArray) {
        this.colorsArray = [...this.colorsArray];
      } else {
        this.colorsArray = Array.from({ length: 2 }).map(x => '#127bdc');
      }
    });
  }

  initColorsArray(): Observable<any> {
    return Observable.create(observer => {
      this.usersService.getUser().subscribe((user: any) => {
        this.colorsArray =
          user.settings && user.settings.colors
            ? user.settings.colors
            : this.colorsArrayDefault;
        this.colorsArrayBS.next(this.colorsArray);
        observer.next(this.colorsArray);
        observer.complete();
      });
    });
  }

  getColorDomain(numColors: number): string[] {
    return _chroma.scale(this.colorsArray).colors(numColors);
  }

  setColorDomain(colorsArray: string[]): void {
    this.colorsArray = colorsArray;
    const user = this.usersService.getCurrentUser();
    if (!user.settings) {
      user.settings = {};
    }
    user.settings.colors = this.colorsArray;
    this.usersService.update(user).subscribe();
  }

  saveAvatar(img) {
    this.avatarImg = img;
    const user = this.usersService.getCurrentUser();
    if (!user.settings) {
      user.settings = {};
    }
    user.settings.avatar = img;
    this.usersService.update(user).subscribe();
  }
}
