import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('user')) {
      // logged in so return true
      return true;
    }
    if (environment.useSaml) {
      console.log('use saml');
      console.log(environment.useSaml);
      //add redirect if no user

      this.userService
        .getUserFromAPI()
        .toPromise()
        .then(user => {
          if (user) {
            this.userService.setUser(user);
          } else {
            //window.redirect
          }
        });

      //not logged in so redirect to adfs/login route
      //window.location.href = `/api/login`;
      return false;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
}
