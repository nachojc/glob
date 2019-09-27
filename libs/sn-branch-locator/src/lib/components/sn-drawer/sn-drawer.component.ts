import {
  Component,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  HostListener
} from '@angular/core';
import {
  DrawerState
} from './models/sn-drawer-state.model';
import { isNumber } from 'util';

@Component({
  selector: 'sn-drawer',
  templateUrl: './sn-drawer.component.html',
  styleUrls: ['./sn-drawer.component.scss']
})
export class SnDrawerComponent implements AfterViewInit, OnChanges {


  @Input() dockedHeight = 50;

  @Input() shouldBounce = true;

  @Input() disableDrag = false;

  @Input() distanceTop = 0;

  @Input() transition = '0.25s ease-in-out';

  @Input() state: DrawerState = DrawerState.Bottom;

  @Input() minimumHeight = 0;

  @Output() stateChange: EventEmitter < DrawerState > = new EventEmitter < DrawerState > ();

  private startPositionTop: number;
  private readonly _BOUNCE_DELTA = 30;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}


  @HostListener('pan', ['$event']) drawerPan(event) {
    this._handlePan(event);
  }

  @HostListener('panstart') drawerPanStart() {
    this.handlePanStart();
  }

  @HostListener('panend', ['$event']) drawerPanEnd(event) {
    this.handlePanEnd(event);
  }

  ngAfterViewInit(): void {

    this.renderer.setStyle(this.elementRef.nativeElement.querySelector('.drawer-handle'),
      'touch-action', 'none');
    this.setDrawerState(this.state);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDrawerState(changes.state.currentValue );
  }

  setDrawerState(state: DrawerState) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
      switch (state) {
        case DrawerState.Top:
          this._setTranslateY(this.distanceTop + 'px');
          break;
        case DrawerState.Docked:
          this._setTranslateY((window.innerHeight - this.dockedHeight) + 'px');
          break;
        default:
          this._setTranslateY('calc(100vh - ' + this.minimumHeight + 'px)');
    }
  }



  private _setTranslateY(value) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'translateY(' + value + ')');
  }

  handlePanStart() {
    this.startPositionTop = this.elementRef.nativeElement.getBoundingClientRect().top;
  }

  handlePanEnd(ev) {
    if (this.shouldBounce && ev.isFinal) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
      switch (this.state) {
        case DrawerState.Top:
          this._handleTopPanEnd(ev);
          break;
        case DrawerState.Docked:
          this.handleDockedPanEnd(ev);
          break;
        default:
          this._handleBottomPanEnd(ev);
      }
    }
    this.stateChange.emit(this.state);
  }

  handleDockedPanEnd(ev) {
    const absDeltaY = Math.abs(ev.deltaY);
    if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY < 0) {
      this.state = DrawerState.Top;
    } else if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY > 0) {
      this.state = DrawerState.Bottom;
    } else {
      this._setTranslateY((window.innerHeight - this.dockedHeight) + 'px');
    }
  }

  private _handleTopPanEnd(ev) {
    if (ev.deltaY > this._BOUNCE_DELTA) {
      this.state = DrawerState.Docked;
    } else {
      this._setTranslateY(this.distanceTop + 'px');
    }
  }

  private _handleBottomPanEnd(ev) {
    if (-ev.deltaY > this._BOUNCE_DELTA) {
      this.state = DrawerState.Docked;
    } else {
      this._setTranslateY('calc(100vh - ' + this.minimumHeight + 'px)');
    }
  }

  private _handlePan(ev) {
    const pointerY = ev.center.y;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'none');
    if (pointerY > 0 && pointerY < window.innerHeight) {
      if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') {
        const newTop = this.startPositionTop + ev.deltaY;
        if (newTop >= this.distanceTop) {
          this._setTranslateY(newTop + 'px');
        } else if (newTop < this.distanceTop) {
          this._setTranslateY(this.distanceTop + 'px');
        }
        if (newTop > window.innerHeight - this.minimumHeight) {
          this._setTranslateY((window.innerHeight - this.minimumHeight) + 'px');
        }
      }
    }
  }

}
