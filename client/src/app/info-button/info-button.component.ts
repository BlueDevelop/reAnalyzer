import { Component, OnInit } from '@angular/core';
import * as IntroJs from 'intro.js';
import { Router } from '@angular/router';
@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.css'],
})
export class InfoButtonComponent implements OnInit {
  hintsDashboard: any = [
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
      hint: 'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
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
  ];

  hintsPrediction: any = [
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
      hint: 'זהו פאנל הסינונים, לאחר לחיצה תוכלו לסננן את המידע שיוצג בגרפים',
    },
    {
      element: '#prediction',
      hint:
        'גרף המציג את התפלגות המשימות בעבר, וכן את חיזוי התפלגות המשימות בשנה הקרובה לפי תאריך יצירה/יעד',
    },
    {
      element: '#weekly',
      hint:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בשבוע בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בשבוע, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
    },
    {
      element: '#trend',
      hint:
        'גרף המציג טרנדים, כלומר שינויים שצפויים בכמות המשימות בעתיד שאינם מחזוריים (לפי תאריך יצירה/יעד)',
    },
    {
      element: '#monthly',
      hint:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בחודש בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בחודש, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
    },
    {
      element: '#yearly',
      hint:
        'גרף המציג את תחזית כמות המשימות המשוערכת לפי היום בשנה בהתאם לתאריך יצירה/יעד. כלומר, ככל שערך הגרף גבוה יותר ביום מסוים בשנה, כך גדלה הסבירות שתאריך היעד/יצירה של משימה יהיה ביום זה',
    },
  ];

  constructor(private router: Router) {
    window.onhashchange = function() {
      IntroJs.introJs().hideHints();
    };
  }

  ngOnInit() {}
  showHints() {
    debugger;
    // IntroJs.introJs().exit();
    console.log('Starting tour');

    // const intro = IntroJs.introJs();
    // // Start tutorial
    // intro.start();
    let url = this.router.url;
    console.log(`url = ${url}`);

    let hints: any;
    if (url.indexOf('dashboard') != -1) {
      console.log('dashboard');
      hints = this.hintsDashboard;

      IntroJs.introJs()
        .setOptions({
          hintButtonLabel: 'סיים',
          hints: this.hintsDashboard,
          exitOnEsc: true,
          scrollToElement: true,
        })
        .refresh()
        .showHints()
        .onhintclose(() => {
          IntroJs.introJs().hideHints();
        });
    } else if (url.indexOf('prediction') != -1) {
      console.log('prediction');
    }
    console.log(hints);
  }
}
