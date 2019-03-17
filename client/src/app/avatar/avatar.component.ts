import { Component, OnInit, Input } from '@angular/core';
import * as _chroma from 'chroma-js';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  @Input()
  initials: String;
  @Input()
  avatar: string;
  @Input()
  name: string;
  color: string;
  constructor() {}

  ngOnInit() {
    this.color = this.name ? _chroma.random().name() : 'rgb(114, 64, 129)';
    this.initials = this.name ? this.getNameInitials(this.name) : this.initials;
    console.log(this.avatar);
  }
  getNameInitials(name?: string) {
    let firstLetter = name[0];
    let secLetter = name.indexOf(' ') == -1 ? '' : name[name.indexOf(' ') + 1];
    return firstLetter + secLetter;
  }
}
