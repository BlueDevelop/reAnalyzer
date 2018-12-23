import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  selectedColor: number = 0;
  colorsArray: string[];
  showX: boolean[];
  isLoaded: boolean = false;

  constructor(private settingsService: SettingsService) {
    settingsService.initColorsArray().subscribe(ret => {
      if (settingsService.colorsArray) {
        this.colorsArray = [...settingsService.colorsArray];
      } else {
        this.colorsArray = Array.from({ length: 2 }).map(x => '#127bdc');
      }
      this.showX = Array.from({ length: this.colorsArray.length }).map(
        x => false
      );
      this.isLoaded = true;
    });
  }

  addColor(): void {
    if (this.colorsArray.length < 15) {
      this.colorsArray.push('#127bdc');
      this.showX.push(false);
      this.selectedColor = this.colorsArray.length - 1;
    }
  }
  saveColors(): void {
    this.settingsService.setColorDomain(this.colorsArray);
  }
  deleteColor(i: number): void {
    this.colorsArray.splice(i, 1);
    this.showX.splice(i, 1);
    if (this.selectedColor >= i) {
      this.selectedColor--;
    }
  }

  resetColors() {
    this.colorsArray = [...this.settingsService.colorsArrayDefault];
  }

  ngOnInit() {}
}
