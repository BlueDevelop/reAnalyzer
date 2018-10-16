import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import  { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTaskCountByStatus(){
    return this.http.get(`${config.apiUrl}/user`);
  }

}
