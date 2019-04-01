import { Component, OnInit } from '@angular/core';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private refresh: RefreshService) {}

  ngOnInit() {}
}
