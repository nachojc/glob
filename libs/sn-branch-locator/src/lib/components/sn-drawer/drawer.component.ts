import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import * as Hammer from 'hammerjs';

import {DrawerState} from './drawer-state.enum';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';

export class DrawerCustomHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      enable: true,
      threshold: 0,
      direction: Hammer.DIRECTION_VERTICAL
    }
  };
}



@Component({
  selector: 'sn-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: DrawerCustomHammerConfig }]
})
export class DrawerComponent implements AfterViewInit, OnChanges {
  @ViewChild('content', {static: false}) contentElement: ElementRef;

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
  private readonly _DOCK_OFFSET = 14;
  public panArea: boolean = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) { }

   @HostListener('pan', ['$event']) drawerPan(event) {
    if (!this.disableDrag && this.panArea) {
      this._handlePan(event);
    }
  }

  @HostListener('panstart', ['$event']) drawerPanStart(event) {
    const header = event.srcEvent.path.find(elem => elem instanceof HTMLElement && elem.getAttribute('draggable') !== null);
    if (header) {
      this.panArea = true;
    }
    if (!this.disableDrag && this.panArea) {
      this.handlePanStart();
    }
  }

  @HostListener('panend', ['$event']) drawerPanEnd(event) {
    if (!this.disableDrag && this.panArea) {
      this.handlePanEnd(event);
    }
    this.panArea = false;
  }

  ngAfterViewInit(): void {
    // this.setDrawerState(this.state);
  }

  getHeaderElement(children): any {
    const size = children.length;
    for (let i = 0; i < size; i++) {
      if (children[i].getAttribute('header') !== null) {
        return children[i];
      }
      if (children[i].children) {
        return this.getHeaderElement(children[i].children);
      }
    }
  }

  setDynamicHeight(children) {
    const header = this.getHeaderElement(children);
    if (header) {
      this.dockedHeight = header.offsetHeight + this._DOCK_OFFSET;
    }
  }

  ngOnChanges(changes: any): void {
    setTimeout(() => {
      this.setDynamicHeight(this.contentElement.nativeElement.children);
      this.setDrawerState(changes.state.currentValue);
    }, 0);
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
