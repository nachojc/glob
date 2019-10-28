import { Component, Input, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { TabLabelEventModel } from './sn-tab.model';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'sn-tab',
  templateUrl: './sn-tab.component.html',
  styleUrls: ['./sn-tab.component.scss']
})
export class SnTabComponent {
  private _label = '';
  @Input()
    get label(): string {
      return this._label;
    }
    set label(value: string) {
      if (value !== this._label) {
        this._label = value || '';
        this._onLabelChange$.next({label: this._label, index: this.index});
      }
    }
  private _onLabelChange$ = new Subject<TabLabelEventModel>();
  private _index: number;
  private _id: string;
  private _active: boolean;

  get index(): number {
    return this._index;
  }
  set index(index: number) {
    this._index = index;
    this._id = `sn-tab-${this._index}`;
  }

  get id(): string {
    return this._id;
  }

  get isTabActive(): boolean {
    return this._active;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  onLabelChange(): Observable<TabLabelEventModel> {
    return this._onLabelChange$.asObservable();
  }

  setTabActive() {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'display');
    this._active = true;
  }

  setTabInactive() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    this._active = false;
  }
}
