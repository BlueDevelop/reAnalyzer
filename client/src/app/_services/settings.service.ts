import { Injectable } from '@angular/core';
import * as _chroma from 'chroma-js';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  //colorDomain: string[] = _chroma.scale(['white', 'black']).colors(20);
  //['#E9A951', '#2E1510']
  constructor() { }

  getColorDomain(numColors: number): string[] {
    return _chroma.scale(['#E9A951', '#237675', '#2E1510']).colors(numColors);
  }

}
