import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import  { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTaskCountByStatus(){
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
    debugger
    return this.http.get(`${config.apiUrl}/task/countByStatus?from=${firstDay}&to=${lastDay}`);
  }

}
