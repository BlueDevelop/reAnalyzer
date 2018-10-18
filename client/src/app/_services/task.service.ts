import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // date = new Date();
  // firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getTime();
  //lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getTime();
  firstDay;
  lastDay;

  constructor(private http: HttpClient) { }

  getTaskCountByStatus() {
    console.log(this.firstDay);
    return this.http.get(`${config.apiUrl}/task/countByStatus?from=${this.firstDay}&to=${this.lastDay}`);
  }

  getFieldCountPerInterval() {
    console.log(this.firstDay);
    let field = "due";
    let interval = "1d";
    return this.http.get(`${config.apiUrl}/task/fieldCountPerInterval?field=${field}&from=${this.firstDay}&to=${this.lastDay}&interval=${interval}`);
  }

  getTagClouds() {
    let size = 40;
    return this.http.get(`${config.apiUrl}/task/tagCloud?from=${this.firstDay}&to=${this.lastDay}`);
  }

  getLeaderboard() {
    let size = 40;
    return this.http.get(`${config.apiUrl}/task/leaderboard?from=${this.firstDay}&to=${this.lastDay}`);
  }
}
