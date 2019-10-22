import {
  Component,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Renderer2,
} from '@angular/core';

import * as Hammer from 'hammerjs';

import { DrawerState } from './drawer-state.enum';




@Component({
  selector: 'sn-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements AfterViewInit, OnChanges {

  @Input() dockedHeight = 50;
  @Input() shouldBounce = true;
  @Input() disableDrag = false;
  @Input() distanceTop = 0;
  @Input() transition = '0.25s ease-in-out';
  @Input() state: DrawerState = DrawerState.Bottom;
  @Input() minimumHeight = 0;


  @Output() stateChange: EventEmitter<DrawerState> = new EventEmitter<DrawerState>();

  private startPositionTop: number;
  private readonly _BOUNCE_DELTA = 30;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) { }

  ngAfterViewInit(): void {
    const hammer = new Hammer(this.elementRef.nativeElement);
    hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_VERTICAL, threshold: 0 });

    hammer.on('pan panstart panend', (ev: any) => {
      if (this.disableDrag) {
        return;
      }

      switch (ev.type) {
        case 'panstart':
          this.handlePanStart();
          break;
        case 'panend':
          this.handlePanEnd(ev);
          break;
        case 'pan':
          this._handlePan(ev);
          break;
        default:
          break;

      }
    });
    this.setDrawerState(this.state);
  }





  ngOnChanges(changes: SimpleChanges): void {
    this.setDrawerState(changes.state.currentValue);
  }

  setDrawerState(state: DrawerState) {
    const parentHeight = this.elementRef.nativeElement.parentElement.clientHeight;
    this.state = state;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
    switch (state) {
      case DrawerState.Bottom:
        this._setTranslateY('calc(100vh - ' + this.minimumHeight + 'px)');
        break;
      case DrawerState.Docked:
        this._setTranslateY((parentHeight - this.dockedHeight) + 'px');
        break;
      default:
        this._setTranslateY(this.distanceTop + 'px');
    }
  }



  private _setTranslateY(value) {
    window.requestAnimationFrame(() => {
      this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'translateY(' + value + ')');
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', 'calc(100% - ' + value + ')');
    });

  }

  handlePanStart() {
    this.startPositionTop = this.elementRef.nativeElement.getBoundingClientRect().top
      - this.elementRef.nativeElement.parentElement.offsetTop;

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
    const parentHeight = this.elementRef.nativeElement.parentElement.clientHeight;
    const absDeltaY = Math.abs(ev.deltaY);
    if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY < 0) {
      this.state = DrawerState.Top;
    } else if (absDeltaY > this._BOUNCE_DELTA && ev.deltaY > 0) {
      this.state = DrawerState.Bottom;
    } else {
      this._setTranslateY((parentHeight - this.dockedHeight) + 'px');
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
    const parentHeight = this.elementRef.nativeElement.parentElement.clientHeight;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'none');
    if (pointerY > 0 && pointerY < parentHeight) {
      if (ev.additionalEvent === 'panup' || ev.additionalEvent === 'pandown') {
        const newTop = this.startPositionTop + ev.deltaY;
        if (newTop >= this.distanceTop) {
          this._setTranslateY(newTop + 'px');
        } else if (newTop < this.distanceTop) {
          this._setTranslateY(this.distanceTop + 'px');
        }
        if (newTop > parentHeight - this.minimumHeight) {
          this._setTranslateY((parentHeight - this.minimumHeight) + 'px');
        }
      }
    }
  }

  public changeState(): void {
    switch (this.state) {
      case DrawerState.Top:
        this.setDrawerState(DrawerState.Docked);
        break;
      case DrawerState.Docked:
        this.setDrawerState(DrawerState.Top);
        break;
      default:
        break;
    }
  }
}
