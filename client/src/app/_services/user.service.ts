import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';
//import { config } from '../../config';
import { environment } from '../../environments/environment';

interface SignupObj {
  uniqueId: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // getAll() {
  //     return this.http.get<User[]>(`${config.apiUrl}/users`);
  // }

  // getById(id: number) {
  //     return this.http.get(`${config.apiUrl}/users/` + id);
  // }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getNameInitials() {
    let name: string = this.getCurrentUser().name;
    let firstLetter = name[0];
    let secLetter = name.indexOf(' ') == -1 ? '' : name[name.indexOf(' ') + 1];
    return firstLetter + secLetter;
  }
  register(user: SignupObj) {
    console.dir('SignUpObj:');
    console.dir(user);
    return this.http.post(`${environment.apiUrl}/user`, user);
  }

  update(user: User) {
    return this.http.put(`${environment.apiUrl}/user`, user);
  }
  getUser() {
    return this.http.get(`${environment.apiUrl}/user`);
  }

  // delete(id: number) {
  //     return this.http.delete(`${config.apiUrl}/users/` + id);
  // }
}
