import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  filterParams: FilterParams = {
    date: { firstDay: 0, lastDay: 0 },
    units: [],
    discussions: [],
    projects: [],
  };

  constructor(private http: HttpClient) {}

  getDiscussionNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/discussion/discussionsNamesList`)
      .pipe(
        tap(data => this.log('fetched data from getDiscussionNameList')),
        catchError(this.handleError('getDiscussionNameList', []))
      );
  }
  getProjectNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/project/projectsNamesList`)
      .pipe(
        tap(data => this.log('fetched data from getProjectNameList')),
        catchError(this.handleError('getProjectNameList', []))
      );
  }
  getUnitNameList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/hierarchy/hierarchiesNamesList`)
      .pipe(
        tap(data => this.log('fetched data from getUnitNameList')),
        catchError(this.handleError('getUnitNameList', []))
      );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`TaskService: ${message}`);
  }
}
