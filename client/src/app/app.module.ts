import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { AppRoutingModule } from '../modules/app-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { ColorPickerModule } from 'ngx-color-picker';

import { HighchartsChartModule } from "highcharts-angular";

// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
import { FilterComponent } from './filter/filter.component';
import { Observable } from 'rxjs';
import { ApexChartComponent } from './apex-charts/apex-chart/apex-chart.component';
import { IntroButtonComponent } from './intro-button/intro-button.component';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';
import { InfoButtonComponent } from './info-button/info-button.component';
import { PdfButtonComponent } from './pdf-button/pdf-button.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TimelineChartComponent } from './timeline-chart/timeline-chart.component';
import { LeaderboardChartComponent } from './leaderboard-chart/leaderboard-chart.component';

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
    SettingsComponent,
    FilterComponent,
    ApexChartComponent,
    IntroButtonComponent,
    FullscreenButtonComponent,
    InfoButtonComponent,
    PdfButtonComponent,
    PieChartComponent,
    TimelineChartComponent,
    LeaderboardChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    TagCloudModule,
    ColorPickerModule,
    HttpClientModule,
    HighchartsChartModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
