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
            element: '#step8',
            hint: 'מסך מלא',
          },
          {
            element: '#step9',
            hint: 'שמירת PDF',
          },
          {
            element: '#step10',
            hint: 'עדכון מידע אוטומטי בכל 5/15/30 שניות',
          },
          {
            element: '#step2',
            hint:
              'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
          },
          {
            element: '#step7',
            hint:
              'גרף המציג את כמות המשימות בכל סטטוס, לחיצה על חלק בגרף תפתח את המשימות המוצגות בו בטבלה',
          },

          {
            element: '#step4',
            hint:
              'גרף המציג את מספר המשימות שנוצרו ואת מספר המשימות שתאריך היעד שלהן בטווח הסינון הנוכחי, בנוסף ניתן לקבץ את המשימות בגרף לפי יום/שבוע/חודש/שנה. לחיצה על נקודה בגרף תראה את המשימות שמוצגות בגרף בטבלה. סימון קטע בגרף יגדיל את אותו הקטע ',
          },
          {
            element: '#step5',
            hint:
              'ענן תגיות, גודל התגית הוא ביחס לשכיחות שלה, לחיצה על תגית תראה בטבלה את המשימות שהתגית מופיע בהן',
          },
          {
            element: '#step6',
            hint:
              'גרף המציג את כמות המשימות שהושלמו ואת כמות שאר המשימות לפי הסינון הנוכחי עבור כל אחראי תחתיי, לחיצה על הגרף תראה את המשימות של אותו אחראי בטבלה',
          },
          {
            element: '#step3',
            hint: 'גרף המציג כמות משימות שנגמרו ביחס לתאריך היעד שלהן',
          },
        ],
      })
      .showHints()
      .onhintclose(() => {
        IntroJs.introJs().hideHints();
      });
  }
}
