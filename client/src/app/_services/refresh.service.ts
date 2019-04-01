import { Injectable } from '@angular/core';
import { interval, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private interval: number = 0;
  public inProgress: number = 0;
  private intervalBS = new BehaviorSubject(0);
  private intervalObservable = this.intervalBS.asObservable();

  //only emit if the interval is dvisiable by the number of seconds passed
  //also if interval is 0 dont emit
  //interval value is in miliseconds
  public source: Observable<number> = interval(1000).pipe(
    filter(i => this.interval !== 0 && i % (this.interval / 1000) === 0)
  );
  // private subscribe: Subscription = this.source.subscribe();
  constructor() {
    this.intervalObservable.subscribe(newVal => {
      this.interval = newVal;
    });
  }
  updateInterval(newInterval: number) {
    this.intervalBS.next(1000 * newInterval); // interval values are in miliseconds
  }
}
