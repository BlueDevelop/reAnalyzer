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
  officeCreated: boolean;
  officeAssign: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  serviceName: string = 'filter';
  config: any;
  predictionConfig: any;
  filterParams: FilterParams = {
    date: { firstDay: 0, lastDay: 0 },
    units: [],
    discussions: [],
    projects: [],
    officeCreated: true,
    officeAssign: false,
  };

  constructor(private http: HttpClient, private logsService: LogsService) {
    this.updateConfig(); //initialize
  }

  updateConfig(): void {
    ////console.log('filterParams');
    console.log(this.filterParams);
    this.config = {
      params: {
        from: this.filterParams.date.firstDay.toString(),
        to: this.filterParams.date.lastDay.toString(),
        projects: this.filterParams.projects.toString(),
        units: this.filterParams.units.toString(),
        discussions: this.filterParams.discussions.toString(),
        officeCreated: this.filterParams.officeCreated,
        officeAssign: this.filterParams.officeAssign,
      },
    };
    this.predictionConfig = {
      params: {
        units: this.filterParams.units.toString(),
        officeCreated: this.filterParams.officeCreated,
        officeAssign: this.filterParams.officeAssign,
      },
    };
  }

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
        tap(data => {
          this.logsService.log(
            this.serviceName,
            'fetched data from getUnitNameList'
          );
        }),
        //map(data => this.flatHierarchy([data])),
        catchError(
          this.logsService.handleError(this.serviceName, 'getUnitNameList', [])
        )
      );
  }

  flatHierarchy(curArr, underWho = '', flatHierarchy = []) {
    curArr.forEach(element => {
      if (element.above) {
        this.flatHierarchy(element.above, element.name, flatHierarchy);
      }
      flatHierarchy.push({
        key: element._id,
        value: element.name,
        under: underWho,
      });
    });
    return flatHierarchy;
  }
}
