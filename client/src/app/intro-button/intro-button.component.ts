import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as IntroJs from 'intro.js';

@Component({
  selector: 'app-intro-button',
  templateUrl: './intro-button.component.html',
  styleUrls: ['./intro-button.component.css'],
})
export class IntroButtonComponent implements OnInit {
  constructor(private router: Router) {}
  stepsDashboard = [
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
      intro: 'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
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
  ];

  stepsPrediction = [
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
      intro: 'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
      position: 'right',
    },
    {
      element: '#prediction',
      intro:
        'גרף המציג את התפלגות המשימות בעבר, וכן את חיזוי התפלגות המשימות בשנה הקרובה לפי תאריך יצירה/יעד',
      position: 'top',
    },
    {
      element: '#weekly',
      intro:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בשבוע בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בשבוע, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
      position: 'top',
    },
    {
      element: '#trend',
      intro:
        'גרף המציג טרנדים, כלומר שינויים שצפויים בכמות המשימות בעתיד שאינם מחזוריים (לפי תאריך יצירה/יעד)',
      position: 'top',
    },
    {
      element: '#monthly',
      intro:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בחודש בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בחודש, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
      position: 'top',
    },
    {
      element: '#yearly',
      intro:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בשנה בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בשנה, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
      position: 'top',
    },
  ];

  ngOnInit() {
    // this.router.events.subscribe(val => {
    //   console.log(val);
    // });
  }

  startTour() {
    let url = this.router.url;
    let steps = [];
    if (url.indexOf('dashboard') != -1) {
      steps = this.stepsDashboard;
    } else if (url.indexOf('prediction') != -1) {
      steps = this.stepsPrediction;
    }
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
        steps: steps,
      })
      .start();
  }
}
