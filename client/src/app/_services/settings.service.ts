import { Injectable } from '@angular/core';
import * as _chroma from 'chroma-js';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  colorsArrayDefault: string[] = ['#E9A951', '#237675', '#2E1510'];
  colorsArray: string[] = ['#E9A951', '#237675', '#2E1510'];
  constructor() { }

  getColorDomain(numColors: number): string[] {
    return _chroma.scale(this.colorsArray).colors(numColors);
  }

  setColorDomain(colorsArray: string[]): void {
    this.colorsArray = colorsArray;
  }



}
