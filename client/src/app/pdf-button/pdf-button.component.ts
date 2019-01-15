import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';

@Component({
  selector: 'app-pdf-button',
  templateUrl: './pdf-button.component.html',
  styleUrls: ['./pdf-button.component.css'],
})
export class PdfButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  savePDF() {
    var data = document.getElementById('dashboard');
    var array = document.querySelectorAll('.ngx-charts .grid-panel rect');
    if (array) {
      array.forEach(function(elem) {
        elem['style'].fill = 'rgba(0,0,0,0)';
      });
    }

    //remove highcharts credit from pdf
    var ignoreHCCElement = document.getElementsByClassName(
      'highcharts-credits'
    );
    ignoreHCCElement[0].setAttribute('data-html2canvas-ignore', 'true');

    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = canvas.width;
      var imgHeight = canvas.height;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('l', 'mm', [imgHeight, imgWidth]);
      const title = `bi-report-${moment().format('DD-MM-YYYY')}.pdf`;
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, width, height);
      //pdf.text(35, 25, title);
      pdf.save(title); // Generated PDF
    });
  }
}
