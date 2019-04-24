import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';
//import { config } from '../../config';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

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

  private initUser = this.getCurrentUser();

  private user = new BehaviorSubject(this.initUser);

  getUser(): Observable<any> {
    return this.user.asObservable();
  }

  setUser(user: object): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.user.next(user);
  }

  // getAll() {
  //     return this.http.get<User[]>(`${config.apiUrl}/users`);
  // }

  // getById(id: number) {
  //     return this.http.get(`${config.apiUrl}/users/` + id);
  // }

  getCurrentUser() {
    let userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromLocalStorage)
      return {
        ...userFromLocalStorage,
        initials: this.getNameInitials(userFromLocalStorage.name),
      };
    else return undefined;
  }

  getNameInitials(name?: string) {
    name = name || this.user.getValue().name;
    let firstLetter = name[0];
    let secLetter = name.indexOf(' ') == -1 ? '' : name[name.indexOf(' ') + 1];
    return firstLetter + secLetter;
  }

  getAvatarImg() {
    return this.getCurrentUser().settings.avatar;
  }

  register(user: SignupObj) {
    console.dir('SignUpObj:');
    console.dir(user);
    return this.http.post(`${environment.apiUrl}/user`, user);
  }

  update(user: User) {
    return this.http.put(`${environment.apiUrl}/user`, user).pipe(
      map((res: any) => res),
      tap(data => this.setUser(data))
    );
  }

  // getPersonsUnderPerson() {
  //   return this.http.get(
  //     `${environment.apiUrl}/hierarchy/getPersonsUnderPerson`
  //   );
  // }

  getPersonsUnderPerson(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/hierarchy/getPersonsUnderPerson`
    );
  }

  getUserFromAPI() {
    return this.http.get(`${environment.apiUrl}/user`);
  }

  // delete(id: number) {
  //     return this.http.delete(`${config.apiUrl}/users/` + id);
  // }
}
