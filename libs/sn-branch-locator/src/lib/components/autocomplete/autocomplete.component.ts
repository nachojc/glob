// tslint:disable-next-line: max-line-length
import {
  Component,
  forwardRef,
  AfterViewChecked,
  AfterContentInit,
  DoCheck,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  IterableDiffers,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import {
  isObject
} from 'util';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent
} from '@angular/animations';




export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => AutocompleteComponent),
  multi: true
};

@Component({
  selector: 'sn-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
  animations: [
    trigger('overlayAnimation', [
      state('void', style({
        transform: 'translateY(5%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void => visible', animate('{{showTransitionParams}}')),
      transition('visible => void', animate('{{hideTransitionParams}}'))
    ])
  ],
})
export class AutocompleteComponent implements AfterViewChecked, AfterContentInit, DoCheck, OnDestroy, ControlValueAccessor {

  @ViewChild('in') inputEL: ElementRef<HTMLInputElement>;

  @ViewChild('panel') panelEL: ElementRef<HTMLDivElement>;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClear: EventEmitter<any> = new EventEmitter();

  @Output() completeMethod: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFocus: EventEmitter<any> = new EventEmitter();

  @Input() type: string = 'text';

  @Input() inputId: string;

  @Input() required: boolean;

  @Input() minLength: number = 1;

  @Input() delay: number = 300;

  @Input() immutable: boolean = true;

  @Input() get suggestions(): any[] {
    return this._suggestions;
  }
  set suggestions(val: any[]) {
    this._suggestions = val;

    if (this.immutable) {
      this.handleSuggestionsChange();
    }
  }

  @Input() autoHighlight: boolean;

  @Input() emptyMessage: string;

  @Input() scrollHeight: string = '200px';

  @Input() showTransitionOptions: string = '225ms ease-out';

  @Input() hideTransitionOptions: string = '195ms ease-in';

  inputFieldValue: string = null;

  overlayVisible: boolean = false;

  documentClickListener: any;

  inputClick: boolean;

  timeout: any;

  // tslint:disable-next-line: variable-name
  _suggestions: any[];

  differ: any;

  loading: boolean;

  highlightOption: any;

  noResults: boolean;

  suggestionsUpdated: boolean;

  inputKeyDown: boolean;

  filled: boolean;

  value: any;

  focus: boolean = false;

  overlay: HTMLDivElement;

  onModelChange: (_: any) => void = (_) => { };

  constructor(public renderer: Renderer2, public differs: IterableDiffers, public cd: ChangeDetectorRef) {
    this.differ = differs.find([]).create(null);
  }

  ngAfterViewChecked(): void {

  }

  ngAfterContentInit(): void {

  }

  ngDoCheck(): void {
    if (!this.immutable) {
      const changes = this.differ.diff(this.suggestions);

      if (changes) {
        this.handleSuggestionsChange();
      }
    }
  }

  ngOnDestroy(): void {

  }

  writeValue(obj: any): void {
    this.value = obj;
    this.filled = this.value && this.value !== '';
    this.updateInputField();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }


  search(event: any, query: string) {
    // allow empty string but not undefined or null
    if (query === undefined || query === null) {
      return;
    }

    this.loading = true;
    this.completeMethod.emit({
      originalEvent: event,
      query
    });
  }
  handleSuggestionsChange(): void {
    if (this._suggestions != null && this.loading) {
      console.log(this._suggestions);
      this.highlightOption = null;
      if (this._suggestions.length) {
        this.noResults = false;
        this.show();
        this.suggestionsUpdated = true;

        if (this.autoHighlight) {
          this.highlightOption = this._suggestions[0];
        }
      } else {
        this.noResults = true;

        if (this.emptyMessage) {
          this.show();
          this.suggestionsUpdated = true;
        } else {
          this.hide();
        }
      }

      this.loading = false;
    }
  }

  show(): void {
    if (this.inputEL) {
      const hasFocus = document.activeElement === this.inputEL.nativeElement;
      if (!this.overlayVisible && hasFocus) {
        this.overlayVisible = true;
      }
    }
  }

  hide(): void {
    this.overlayVisible = false;
  }

  updateInputField(): void {
    const formattedValue = this.value || '';
    this.inputFieldValue = formattedValue;

    if (this.inputEL && this.inputEL.nativeElement) {
      this.inputEL.nativeElement.value = formattedValue;
    }

    this.updateFilledState();
  }

  updateFilledState() {
    this.filled = (this.inputFieldValue && this.inputFieldValue !== '') ||
      (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value !== '');
  }

  onInputClick(event: MouseEvent) {
    if (this.documentClickListener) {
      this.inputClick = true;
    }
  }

  onInputFocus(event) {
    this.focus = true;
    this.onFocus.emit(event);
  }

  onInput(event: Event) {

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const value = (event.target as HTMLInputElement).value;
    if (value.length === 0) {
      this.hide();
      this.onClear.emit(event);
      this.onModelChange(value);
    }

    if (value.length >= this.minLength) {
      this.timeout = setTimeout(() => {
        this.search(event, value);
      }, this.delay);
    } else {
      this.suggestions = null;
      this.hide();
    }
    this.updateFilledState();
    this.inputKeyDown = false;
  }

  resolveFieldData(option) {
    if (isObject(option) && option.hasOwnProperty('label')) {
      return option.label;
    } else {
      return option;
    }
  }


  focusInput() {
    this.inputEL.nativeElement.focus();
  }

  selectItem(option: any, focus: boolean = true) {
    this.inputEL.nativeElement.value = this.resolveFieldData(option);
    this.value = option;
    this.onModelChange(this.value);


    this.onSelect.emit(option);
    this.updateFilledState();

    if (focus) {
      this.focusInput();
    }
  }

  bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
        if (event.which === 3) {
          return;
        }

        if (!this.inputClick) {
          this.hide();
        }

        this.inputClick = false;
        this.cd.markForCheck();
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }


  onOverlayHide() {
    this.unbindDocumentClickListener();
    this.overlay = null;
  }

  onOverlayAnimationStart(event: AnimationEvent) {
    switch (event.toState) {
      case 'visible':
        this.overlay = event.element;
        this.bindDocumentClickListener();

        break;

      case 'void':
        this.onOverlayHide();
        break;
    }
  }



}
