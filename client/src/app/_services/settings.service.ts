import { Injectable } from '@angular/core';
import * as _chroma from 'chroma-js';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  colorsArrayDefault: string[] = ['#E9A951', '#237675', '#2E1510'];
  colorsArray: string[];

  constructor(private usersService: UserService) {}

  initColorsArray(): Observable<any> {
    return Observable.create(observer => {
      this.usersService.getUser().subscribe((user: any) => {
        this.colorsArray =
          user.settings && user.settings.colors
            ? user.settings.colors
            : this.colorsArrayDefault;
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
}
