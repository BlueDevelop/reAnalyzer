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
export class TaskService {
  serviceName: string = 'task';

  constructor(
    private http: HttpClient,
    private filterService: FilterService,
    private logsService: LogsService,
    private translate: TranslateService
  ) {}

  getTaskCountByStatus(): Observable<any> {
    return this.http
      .get(
        `${environment.apiUrl}/task/countByStatus`,
        this.filterService.config
      )
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from TaskCountByStatus'
          )
        ),
        catchError(
          this.logsService.handleError(
            this.serviceName,
            'getTaskCountByStatus',
            []
          )
        )
      );
  }

  getFieldCountPerInterval(): Observable<any> {
    const getObservableForInterval = field => {
      let newConfig = this.filterService.config;
      newConfig.params['field'] = field; //'due';
      //newConfig.params['interval'] = interval;
      return this.http
        .get(`${environment.apiUrl}/task/fieldCountPerInterval`, newConfig)
        .pipe(
          tap(data => {
            this.logsService.log(
              this.serviceName,
              'fetched data from getFieldCountPerInterval'
            );
          }),
          catchError(
            this.logsService.handleError(
              this.serviceName,
              'getFieldCountPerInterval',
              []
            )
          )
        );
    };
    return forkJoin([
      getObservableForInterval('due'),
      getObservableForInterval('created'),
    ]);
  }

  getTagClouds(): Observable<any> {
    let newConfig = { ...this.filterService.config };
    newConfig.params['size'] = '40';
    return this.http.get(`${environment.apiUrl}/task/tagCloud`, newConfig).pipe(
      tap(data =>
        this.logsService.log(this.serviceName, 'fetched data from TagClouds')
      ),
      catchError(
        this.logsService.handleError(this.serviceName, 'getTagClouds', [])
      )
    );
  }

  getLeaderboard(): Observable<any> {
    let newConfig = { ...this.filterService.config };
    newConfig.params['size'] = '5';
    return this.http
      .get(`${environment.apiUrl}/task/leaderboard`, newConfig)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from Leaderboard'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getLeaderboard', [])
        )
      );
  }

  getTimeRates(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/task/endTimeRatio`, this.filterService.config)
      .pipe(
        tap(data =>
          this.logsService.log(this.serviceName, 'fetched data from TimeRates')
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getTimeRates', [])
        )
      );
  }

  getTasksByFilter(filter: object): Observable<any> {
    if ('status' in filter) {
      filter['status'] = this.translate.instant(filter['status']);
    }

    if ('name' in filter) {
      filter['name'] = this.translate.instant(filter['name']);
    }

    let newFilter = { ...this.filterService.config.params, ...filter };
    newFilter = {
      params: newFilter,
    };

    if ('assign.id' in newFilter.params) {
      newFilter.params['officeCreated'] = false;
      newFilter.params['officeAssign'] = false;
    }
    // if (
    //   newFilter.params['interval'] == 'without' ||
    //   newFilter.params['interval'] == 'day'
    // ) {
    //   newFilter.params['from'] = newFilter.params['date'];
    //   newFilter.params['to'] = newFilter.params['date'];
    // } else if (newFilter.params['interval'] == 'week') {
    //   newFilter.params['from'] = moment(newFilter.params['date'])
    //     .subtract(1, 'weeks')
    //     .startOf('week')
    //     .milliseconds();

    //   newFilter.params['to'] = moment(newFilter.params['date'])
    //     .subtract(1, 'weeks')
    //     .endOf('week')
    //     .milliseconds();
    // } else if (newFilter.params['interval'] == 'month') {
    //   newFilter.params['from'] = moment(newFilter.params['date'])
    //     .subtract(1, 'months')
    //     .startOf('month')
    //     .milliseconds();

    //   newFilter.params['to'] = moment(newFilter.params['date'])
    //     .subtract(1, 'months')
    //     .endOf('month')
    //     .milliseconds();
    // } else {
    //   newFilter.params['from'] = moment(newFilter.params['date'])
    //     .startOf('year')
    //     .milliseconds();

    //   newFilter.params['to'] = moment(newFilter.params['date'])
    //     .endOf('year')
    //     .milliseconds();
    // }

    console.log(newFilter);
    return this.http
      .get(`${environment.apiUrl}/task/tasksByFilter`, newFilter)
      .pipe(
        tap(data =>
          this.logsService.log(this.serviceName, 'fetched data from TimeRates')
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getTimeRates', [])
        )
      );
  }
}
