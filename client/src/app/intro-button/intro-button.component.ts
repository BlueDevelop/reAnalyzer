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
    //console.log('Starting tour');

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
            element: '#step8',
            intro: 'מסך מלא',
            position: 'left',
          },
          {
            element: '#step9',
            intro: 'שמירת PDF',
            position: 'left',
          },
          {
            element: '#step10',
            intro: 'עדכון מידע אוטומטי בכל 5/15/30 שניות',
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
            intro:
              'גרף המציג את כמות המשימות בכל סטטוס, לחיצה על חלק בגרף תפתח את המשימות המוצגות בו בטבלה',
            position: 'left',
          },

          {
            element: '#step4',
            intro:
              'גרף המציג את מספר המשימות שנוצרו ואת מספר המשימות שתאריך היעד שלהן בטווח הסינון הנוכחי, בנוסף ניתן לקבץ את המשימות בגרף לפי יום/שבוע/חודש/שנה. לחיצה על נקודה בגרף תראה את המשימות שמוצגות בגרף בטבלה. סימון קטע בגרף יגדיל את אותו הקטע ',
            position: 'left',
          },
          {
            element: '#step5',
            intro:
              'ענן תגיות, גודל התגית הוא ביחס לשכיחות שלה, לחיצה על תגית תראה בטבלה את המשימות שהתגית מופיע בהן',
            position: 'right',
          },
          {
            element: '#step6',
            intro:
              'גרף המציג את כמות המשימות שהושלמו ואת כמות שאר המשימות לפי הסינון הנוכחי עבור כל אחראי תחתיי, לחיצה על הגרף תראה את המשימות של אותו אחראי בטבלה',
            position: 'right',
          },
          {
            element: '#step3',
            intro: 'גרף המציג כמות משימות שנגמרו ביחס לתאריך היעד שלהן',
            position: 'right',
          },
        ],
      })
      .start();
  }
}
