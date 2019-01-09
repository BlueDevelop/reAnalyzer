import { Component, OnInit } from '@angular/core';
import * as IntroJs from 'intro.js';

@Component({
  selector: 'app-intro-button',
  templateUrl: './intro-button.component.html',
  styleUrls: ['./intro-button.component.css'],
})
export class IntroButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  startTour() {
    console.log('Starting tour');

    // const intro = IntroJs.introJs();
    // // Start tutorial
    // intro.start();
    IntroJs.introJs()
      .setOptions({
        showBullets: false,
        showStepNumbers: false,
        // scrollToElement: false,
        // scrollTo: false,
        // scrollPadding: '-20px',
        nextLabel: 'הבא',
        prevLabel: 'הקודם',
        skipLabel: 'דלג',
        doneLabel: 'סיים',
        hideNext: true, // hides next button in the last step
        hidePrev: true, // hides prev button in the first step
        steps: [
          {
            element: '#step1',
            intro: 'זהו מדריך קצר על המערכת',
            position: 'left',
          },
          {
            element: '#step2',
            intro:
              'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
            position: 'right',
          },
          {
            element: '#step7',
            intro: 'גרף המציג את כמות המשימות בכל סטטוס',
            position: 'left',
          },

          {
            element: '#step4',
            intro:
              'גרף המציג את כמות המשימות שתאריך היעד שלהם הוא בטווח התאריכים שנבחרו',
            position: 'left',
          },
          {
            element: '#step5',
            intro: 'ענן תגיות, גודל התגית הוא ביחס לשכיחות שלה',
            position: 'right',
          },
          {
            element: '#step6',
            intro: 'גרף המציג את כמות המשימות שהושלמו עבור כל אחראי תחתיי',
            position: 'right',
          },
          {
            element: '#step3',
            intro:
              'גרף המציג כמות משימות שנגמרו ביחס לתאריך היעד שלהם, משימות שסויימו זמן רב לאחר תאריך היעד שלהם יופיעו מעל +',
            position: 'right',
          },
        ],
      })
      .start();
  }
}
