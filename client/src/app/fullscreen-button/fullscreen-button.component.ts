import { Component, OnInit } from '@angular/core';
import * as screenfull from 'screenfull';
@Component({
  selector: 'app-fullscreen-button',
  templateUrl: './fullscreen-button.component.html',
  styleUrls: ['./fullscreen-button.component.css'],
})
export class FullscreenButtonComponent implements OnInit {
  constructor() {}
  fullscreen() {
    console.log('something');
    const dashboard = document.getElementById('dashboard'); //documentElement;
    // if (dashboard.requestFullscreen) {
    //   dashboard.requestFullscreen();
    // } else if (dashboard['mozRequestFullScreen']) {
    //   /* Firefox */
    //   dashboard['mozRequestFullScreen']();
    // } else if (dashboard['webkitRequestFullscreen']) {
    //   /* Chrome, Safari & Opera */
    //   dashboard['webkitRequestFullscreen']();
    // } else if (dashboard['msRequestFullscreen']) {
    //   /* IE/Edge */
    //   dashboard['msRequestFullscreen'];
    // }
    screenfull.request(dashboard);
  }

  ngOnInit() {}
}
