import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginRequest {
  uniqueId: string;
  password: String;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(loginRequest?: LoginRequest) {
    if (environment.useSaml) {
      return this.http.get(`${environment.apiUrl}/user`).pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
          } else {
          }

          return user;
        })
      );
    } else {
      return this.http.post(`${environment.apiUrl}/login`, loginRequest).pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
          }

          return user;
        })
      );
    }
  }

  logout() {
    //remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
