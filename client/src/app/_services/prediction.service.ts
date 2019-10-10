import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { config } from '../../config';
import { environment } from '../../environments/environment';
import { FilterService } from './filter.service';
import { LogsService } from './logs.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  serviceName: string = 'prediction';

  constructor(
    private http: HttpClient,
    private filterService: FilterService,
    private logsService: LogsService
  ) {}

  predictFieldCountPerInterval(field): Observable<any> {
    let newConfig = this.filterService.predictionConfig;
    newConfig.params['field'] = field; //'due';
    return this.http
      .get(
        `${environment.apiUrl}/prediction/predictFieldCountPerInterval`,
        newConfig
      )
      .pipe(
        tap(data => {
          this.logsService.log(
            this.serviceName,
            'fetched data from predictFieldCountPerInterval'
          );
        }),
        catchError(
          this.logsService.handleError(
            this.serviceName,
            'predictFieldCountPerInterval',
            []
          )
        )
      );
  }
}
