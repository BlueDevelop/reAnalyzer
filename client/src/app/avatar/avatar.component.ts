import { Component, OnInit, Input } from '@angular/core';

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

  constructor() {}

  ngOnInit() {
    this.initials = this.getNameInitials(this.name);
    console.log(this.avatar);
  }
  getNameInitials(name?: string) {
    let firstLetter = name[0];
    let secLetter = name.indexOf(' ') == -1 ? '' : name[name.indexOf(' ') + 1];
    return firstLetter + secLetter;
  }
}
