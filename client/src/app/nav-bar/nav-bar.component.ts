import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  currentUser;
  nameInitials: string;

  navLinks = [
    { path: [{ outlets: { app: ['dashboard'] } }], label: 'לוח ראשי' },
    { path: [{ outlets: { app: ['units'] } }], label: 'units' },
    { path: [{ outlets: { app: ['projects'] } }], label: 'פרויקטים' },
    { path: [{ outlets: { app: ['users'] } }], label: 'משתמשים' },
    { path: [{ outlets: { app: ['settings'] } }], label: 'הגדרות' },
  ];

  constructor(private userService: UserService) {
    this.nameInitials = userService.getNameInitials();
  }
  ngOnInit() {}
}
