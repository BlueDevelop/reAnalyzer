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

  getOpenTasks(officeCreated: boolean, officeAssign: boolean): Observable<any> {
    let newConfig = JSON.parse(JSON.stringify(this.filterService.config));
    newConfig.params.officeCreated = officeCreated;
    newConfig.params.officeAssign = officeAssign;
    return this.http
      .get(`${environment.apiUrl}/task/openTasks`, newConfig)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from getOpenTasks'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getOpenTasks', [])
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
      getObservableForInterval('closed'),
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

  getMyTasks(filter: object): Observable<any> {
    let configFilter = { ...this.filterService.config.params };
    delete configFilter.officeAssign;
    delete configFilter.officeCreated;

    let newFilter = { ...configFilter, ...filter };
    newFilter = {
      params: newFilter,
    };

    return this.http
      .get(`${environment.apiUrl}/task/getMyTasks`, newFilter)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from TasksByFilter'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getTasksByFilter', [])
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
    } else if ('name' in filter) {
      filter['name'] = this.translate.instant(filter['name']);
      let interval =
        filter['interval'] == 'without' ? 'hour' : filter['interval'];
      delete filter['interval'];
      //delete filter['date'];
      if (interval) {
        filter['from'] = moment(filter['date'])
          .startOf(interval)
          .valueOf();
        filter['to'] = moment(filter['date'])
          .endOf(interval)
          .valueOf();
      }
    } else if ('minRatio' in filter) {
      filter['status'] = 'done';
    }
    let newFilter = { ...this.filterService.config.params, ...filter };
    newFilter = {
      params: newFilter,
    };
    return this.http
      .get(`${environment.apiUrl}/task/tasksByFilter`, newFilter)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from TasksByFilter'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getTasksByFilter', [])
        )
      );
  }
}
