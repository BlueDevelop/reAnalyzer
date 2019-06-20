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
    private logsService: LogsService,
    private translate: TranslateService
  ) {}

  predictTaskCountByStatus(): Observable<any> {
    return undefined;
  }

  predictFieldCountPerInterval(field): Observable<any> {
    const getObservableForInterval = field => {
      let newConfig = this.filterService.predictionConfig;
      newConfig.params['field'] = field; //'due';
      //newConfig.params['interval'] = interval;
      console.log(`newConfig`);
      console.log(newConfig);
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
    };
    return getObservableForInterval(field);
  }

  predictTagClouds(): Observable<any> {
    return undefined;
  }

  predictLeaderboard(): Observable<any> {
    return undefined;
  }

  predictTimeRates(): Observable<any> {
    return undefined;
  }
}
