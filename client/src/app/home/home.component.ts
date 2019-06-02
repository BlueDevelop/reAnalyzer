import {
  Component,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  AfterViewInit,
  ViewRef,
} from '@angular/core';
import { RefreshService } from '../_services/refresh.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private inProgress: number = 0;
  private show: boolean = true;
  @ViewChild('vc', { read: ViewContainerRef })
  vc: ViewContainerRef;
  @ViewChild('tpl', { read: TemplateRef })
  tpl: TemplateRef<any>;
  constructor(
    private refresh: RefreshService,
    private cdRef: ChangeDetectorRef
  ) {}
  childViewRef: ViewRef;

  ngAfterViewInit() {
    this.childViewRef = this.tpl.createEmbeddedView(null);
    this.vc.insert(this.childViewRef);
  }

  ngOnInit() {
    // this.vc.insert(this.childViewRef);
    setTimeout(() => this.vc.detach(), 5000);
    this.refresh.inProgressObservable.subscribe(newVal => {
      this.inProgress = newVal;
      //this.cdRef.detectChanges();
    });
  }
}
