import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavButtonsComponent } from './sidenav-buttons/sidenav-buttons.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ChartBarDateComponent } from './chart-bar-date/chart-bar-date.component';
import { PieComponent } from './charts/pie/pie.component';
import { BarComponent } from './charts/bar/bar.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AvatarComponent } from './avatar/avatar.component';
import { TagCloudComponent } from './tag-cloud/tag-cloud.component';
import { PieStatusComponent } from './pie-status/pie-status.component';
import { BarHorizontalComponent } from './charts/bar-horizontal/bar-horizontal.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { GroupedVerticalBarComponent } from './charts/grouped-vertical-bar/grouped-vertical-bar.component';
import { TimeRatesComponent } from './time-rates/time-rates.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidenavButtonsComponent,
    NavBarComponent,
    ChartBarDateComponent,
    PieComponent,
    BarComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    AvatarComponent,
    TagCloudComponent,
    PieStatusComponent,
    BarHorizontalComponent,
    LeaderBoardComponent,
    GroupedVerticalBarComponent,
    TimeRatesComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    TagCloudModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
