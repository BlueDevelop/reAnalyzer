import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LogsService } from './logs.service';

interface FilterParams {
  date: {
    firstDay: number;
    lastDay: number;
  };
  units: object[];
  discussions: string[];
  projects: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  serviceName: string = 'filter';
  filterParams: FilterParams = {
    date: { firstDay: 0, lastDay: 0 },
    units: [],
    discussions: [],
    projects: [],
  };

  constructor(private http: HttpClient, private logsService: LogsService) {}

  getDiscussionNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/discussion/discussionsNamesList`)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from getDiscussionNameList'
          )
        ),
        catchError(
          this.logsService.handleError(
            this.serviceName,
            'getDiscussionNameList',
            []
          )
        )
      );
  }
  getProjectNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/project/projectsNamesList`)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from getProjectNameList'
          )
        ),
        catchError(
          this.logsService.handleError(
            this.serviceName,
            'getProjectNameList',
            []
          )
        )
      );
  }
  getUnitNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/hierarchy/hierarchiesNamesList`)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from getUnitNameList'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getUnitNameList', [])
        )
      );
  }
}
