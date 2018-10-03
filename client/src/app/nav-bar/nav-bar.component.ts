import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  navLinks = [
    {path:[{outlets: {'app': ['dashboard']}}], label:"לוח ראשי"},
    {path:[{outlets: {'app': ['units']}}], label:"חברות"},
    {path:[{outlets: {'app': ['project']}}], label:"פרויקטים"},
    {path:[{outlets: {'app': ['users']}}], label:"משתמשים"},
    {path:[{outlets: {'app': ['settings']}}], label:"הגדרות"}
  ]

  constructor() { }

  ngOnInit() {
  }

}
