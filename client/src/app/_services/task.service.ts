import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { config } from '../../config';
import { environment } from '../../environments/environment';

interface FilterParams {
  date: {
    firstDay: number,
    lastDay: number
  },
  units: string[],
  discussions: string[],
  projects: string[]
}


@Injectable({
  providedIn: 'root'
})

export class TaskService {

  // firstDay;
  // lastDay;

  filterParams: FilterParams = {
    date: { firstDay: 0, lastDay: 0 },
    units: [],
    discussions: [],
    projects: []
  };

  constructor(private http: HttpClient) { }

  getTaskCountByStatus(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/task/countByStatus?from=${this.filterParams.date.firstDay}&to=${this.filterParams.date.lastDay}`).pipe(
      tap(data => this.log('fetched data from TaskCountByStatus')),
      catchError(this.handleError('getTaskCountByStatus', []))
    );
  }

  getFieldCountPerInterval(interval): Observable<any> {
    let field = "due";
    console.log(interval);
    //let interval = "1d";
    return this.http.get(`${environment.apiUrl}/task/fieldCountPerInterval?field=${field}&from=${this.filterParams.date.firstDay}&to=${this.filterParams.date.lastDay}&interval=${interval}`).pipe(
      tap(data => this.log('fetched data from getFieldCountPerInterval')),
      catchError(this.handleError('getFieldCountPerInterval', []))
    );
  }


  getTagClouds(): Observable<any> {
    let size = 40;
    return this.http.get(`${environment.apiUrl}/task/tagCloud?from=${this.filterParams.date.firstDay}&to=${this.filterParams.date.lastDay}`).pipe(
      tap(data => this.log('fetched data from TagClouds')),
      catchError(this.handleError('getTagClouds', []))
    );
  }

  getLeaderboard(): Observable<any> {
    let size = 40;
    return this.http.get(`${environment.apiUrl}/task/leaderboard?from=${this.filterParams.date.firstDay}&to=${this.filterParams.date.lastDay}`).pipe(
      tap(data => this.log('fetched data from Leaderboard')),
      catchError(this.handleError('getLeaderboard', []))
    );
  }


  getTimeRates(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/task/endTimeRatio?from=${this.filterParams.date.firstDay}&to=${this.filterParams.date.lastDay}`).pipe(
      tap(data => this.log('fetched data from TimeRates')),
      catchError(this.handleError('getTimeRates', []))
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
