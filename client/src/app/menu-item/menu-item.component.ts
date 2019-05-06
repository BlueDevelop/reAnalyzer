import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatMenu } from '@angular/material';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent implements OnInit {
  @Input()
  items: any;
  @Output()
  ValueClick: EventEmitter<object> = new EventEmitter<object>();

  @ViewChild('childMenu')
  public childMenu;
  constructor() {}
  ngOnInit() {}

  onClick(e) {
    debugger;
    this.ValueClick.emit(e);
  }
}
