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
  chartColorsOrdinal = [
    {
      name: 'Vivid',
      colors: [
        '#62CD8C',
        '#3D4EB4',
        '#1594F2',
        '#00B965',
        '#B7DF3F',
        '#99B726',
        '#F4E667',
        '#FF990D',
        '#FF5821',
        '#D24018',
      ],
    },
    {
      name: 'Natural',
      colors: [
        '#C09E77',
        '#EA9551',
        '#D9A05B',
        '#F2E0A8',
        '#F2E0A8',
        '#A4D7C6',
        '#7693B1',
        '#AFAFAF',
        '#707160',
        '#D9D5C3',
      ],
    },
    {
      name: 'Cool',
      colors: [
        '#ACCCED',
        '#A9E3F5',
        '#7CD2ED',
        '#4DAACC',
        '#79A2E4',
        '#8695BF',
        '#A27DA7',
        '#AE6785',
        '#AA5963',
        '#A9375C',
      ],
    },
    {
      name: 'Fire',
      colors: [
        '#FF3E00',
        '#C0370A',
        '#FF900B',
        '#FF7002',
        '#FF3E00',
        '#FF5821',
        '#E75200',
        '#FFCC31',
        '#FFAC12',
        '#FF7002',
      ],
    },
    {
      name: 'Solar',
      colors: [
        '#FFF8E1',
        '#FFEDB4',
        '#FFE184',
        '#FFD654',
        '#FFCC31',
        '#FFC31B',
        '#FFB414',
        '#FFA10F',
        '#FF900B',
        '#FF7002',
      ],
    },
    {
      name: 'Air',
      colors: [
        '#E1F5FE',
        '#B2E5FC',
        '#7FD3F9',
        '#4AC2F6',
        '#1EB5F5',
        '#00A7F3',
        '#0099E4',
        '#0086D0',
        '#0075BC',
        '#00559A',
      ],
    },
    {
      name: 'Aqua',
      colors: [
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
      ],
    },
    {
      name: 'Fresh & Bright',
      colors: ['#F98866', '#FF420E', '#0BD9E', '#89DA59'],
    },
    {
      name: 'Subdued & Professional',
      colors: ['#90AFC5', '#336B87', '#2A3132', '#763626'],
    },
    {
      name: 'Crisp & Dramatic',
      colors: ['#505160', '#68823E', '#AEBD38', '#598234'],
    },
    {
      name: 'Outdoorsy & Natural',
      colors: ['#2E4600', '#486B00', '#A2C523', '#7D4427'],
    },
    {
      name: 'Primary Colors With a Vibrant Twist',
      colors: ['#375E97', '#FB6542', '#FFBB00', '#3F681C'],
    },
    {
      name: 'Refreshing & Pretty',
      colors: ['#98DBC6', '#5BC8AC', '#E6D72A', '#F18D9E'],
    },
    {
      name: 'Fresh & Energetic',
      colors: ['#4CB5F6', '#B7B8B6', '#34675C', '#B3C100'],
    },
    {
      name: 'Icy Blues and Grays',
      colors: ['#F1F1F2', '#BCBABE', '#A1D6E2', '#1995AD'],
    },
    {
      name: 'Birds & Berries',
      colors: ['#9A9EAB', '#5D535E', '#EC96A4', '#DFE166'],
    },
    {
      name: 'Bright & Tropical',
      colors: ['#F52549', '#FA6775', '#FFD64D', '#9BC01C'],
    },
    {
      name: 'Summer Sunflower',
      colors: ['#34888C', '#7CAA2D', '#F5E356', '#CB6318'],
    },
    {
      name: 'Bold Berries',
      colors: ['#50312F', '#cb00000', '#E4EA8C', '#3F6C45'],
    },
    {
      name: 'Timeless & Nautical',
      colors: ['#00293C', '#1E656D', '#F1F3CE', '#F62A00'],
    },
    {
      name: 'Neutral & Versatile',
      colors: ['#626D71', '#CDCDC0', '#DDBC95', '#B38867'],
    },
    {
      name: 'Cheerful Brights',
      colors: ['#258039', '#F5BE41', '#31A9B8', '#CF3721'],
    },
    {
      name: 'Berry Blues',
      colors: ['#1E1F26', '#283655', '#4D648D', '#D0E1F9'],
    },
    {
      name: 'Sunny Citrus',
      colors: ['#FAAF08', '#FA812F', '#FA4032', '#FEF3E2'],
    },
    {
      name: 'Crisp Complementary Colors',
      colors: ['#F4EC6A', '#BBCF4A', '#E73FOB', '#A11FOC'],
    },
    {
      name: 'Candy-Coated Brights',
      colors: ['#F47D4A', '#E1315B', '#FFEC5C', '#008DCB'],
    },
    {
      name: 'Nightlife',
      colors: ['#00CFFA', '#FF0038', '#FFCE38', '#020509'],
    },
    {
      name: 'Mediterranean Afternoon',
      colors: ['#8C0004', '#C8000A', '#E8A735', '#E2C499'],
    },
    {
      name: 'צוק איתן',
      colors: [
        '#F75142',
        '#FBD272',
        '#ED2738',
        '#F4F8FD',
        '#045FBF',
        '#F4F8FD',
        '#ED2738',
        '#FBD272',
        '#F75142',
      ],
    },
    {
      name: 'מלחמת לבנון השניה',
      colors: [
        '#E4E8E8',
        '#1D4A88',
        '#ECE1E8',
        '#C7763C',
        '#4B6A3E',
        '#B53C39',
        '#4B6A3E',
        '#C7763C',
        '#ECE1E8',
        '#1D4A88',
        '#E4E8E8',
      ],
    },
    {
      name: 'מלחמת שלום הגליל',
      colors: [
        '#B3363C',
        '#E3E3E5',
        '#5B1E9D',
        '#E0F3EA',
        '#239032',
        '#B83325',
        '#239032',
        '#E0F3EA',
        '#5B1E9D',
        '#E3E3E5',
        '#B3363C',
      ],
    },
    {
      name: 'מלחמת יום הכיפורים',
      colors: [
        '#36719D',
        '#E4E4E1',
        '#36719D',
        '#E4E4E1',
        '#B5191D',
        '#E4E4E1',
        '#36719D',
        '#E4E4E1',
        '#36719D',
      ],
    },
    {
      name: 'מלחמת ההתשה',
      colors: [
        '#BA613F',
        '#DBEAF6',
        '#6B9EC0',
        '#DBEAF6',
        '#BD6540',
        '#C21E1D',
        '#BD6540',
        '#DBEAF6',
        '#6B9EC0',
        '#DBEAF6',
        '#BA613F',
      ],
    },
    {
      name: 'מלחמת ששת הימים',
      colors: [
        '#B7342E',
        '#0B4BA4',
        '#F0EBE8',
        '#6EA6CE',
        '#F0EBE8',
        '#0B4BA4',
        '#B7342E',
      ],
    },
    {
      name: 'מלחמת סיני',
      colors: [
        '#E27F24',
        '#054392',
        '#B13036',
        '#7A94BF',
        '#B13036',
        '#054392',
        '#E27F24',
      ],
    },
    {
      name: 'מלחמת העצמאות',
      colors: [
        '#035097',
        '#D9EAEF',
        '#7EA3C7',
        '#D9EAEF',
        '#0E4D9A',
        '#A23833',
        '#0E4D9A',
        '#D9EAEF',
        '#7EA3C7',
        '#D9EAEF',
        '#035097',
      ],
    },
  ];

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

  changeColors(colors: string[]): void {
    this.colorsArray = [...colors];
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
