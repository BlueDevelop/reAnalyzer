import { Component, OnInit } from '@angular/core';
import * as IntroJs from 'intro.js';
@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.css'],
})
export class InfoButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  showHints() {
    console.log('Starting tour');

    // const intro = IntroJs.introJs();
    // // Start tutorial
    // intro.start();
    const introjs = IntroJs.introJs()
      .setOptions({
        // showBullets: false,
        // showStepNumbers: false,
        // // scrollToElement: false,
        // // scrollTo: false,
        // // scrollPadding: '-20px',
        // nextLabel: 'הבא',
        // prevLabel: 'הקודם',
        // skipLabel: 'דלג',
        // doneLabel: 'סיים',
        // hideNext: true, // hides next button in the last step
        // hidePrev: true, // hides prev button in the first step
        hintButtonLabel: 'סיים',
        hints: [
          {
            element: '#step1',
            hint: 'זהו מדריך קצר על המערכת',
          },
          {
            element: '#step2',
            hint:
              'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
          },
          {
            element: '#step3',
            hint:
              'גרף המציג כמות משימות שנגמרו ביחס לתאריך היעד שלהם, משימות שסויימו זמן רב לאחר תאריך היעד שלהם יופיעו מעל +',
          },
          {
            element: '#step4',
            hint:
              'גרף המציג את כמות המשימות שתאריך היעד שלהם הוא בטווח התאריכים שנבחרו',
          },
          {
            element: '#step5',
            hint: 'ענן תגיות, גודל התגית הוא ביחס לשכיחות שלה',
          },
          {
            element: '#step6',
            hint: 'גרף המציג את כמות המשימות שהושלמו עבור כל אחראי תחתיי',
          },
          {
            element: '#step7',
            hint: 'גרף המציג את כמות המשימות בכל סטטוס',
          },
        ],
      })
      .showHints()
      .onhintclose(() => {
        IntroJs.introJs().hideHints();
      });
  }
}
