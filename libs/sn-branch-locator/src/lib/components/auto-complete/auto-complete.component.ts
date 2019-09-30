// tslint:disable-next-line: max-line-length
import { Component, ViewChild, ElementRef, forwardRef, AfterViewChecked, AfterContentInit, DoCheck, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => AutoCompleteComponent ),
  multi: true
};

@Component({
  selector: 'sn-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AutoCompleteComponent implements AfterViewChecked, AfterContentInit, DoCheck, OnDestroy, ControlValueAccessor {


  @ViewChild('in') inputEL: ElementRef<HTMLInputElement>;

  @ViewChild('ddBtn') dropdownButton: ElementRef<HTMLButtonElement>;

  @ViewChild('multiIn') multiInputEL: ElementRef<HTMLInputElement>;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClear: EventEmitter<Event> = new EventEmitter<Event>();

  // tslint:disable-next-line: max-line-length
  @Output() completeMethod: EventEmitter<{ originalEvent: Event, query: string}> = new EventEmitter<{ originalEvent: Event, query: string}>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onUnselect: EventEmitter<any> = new EventEmitter();

  inputFieldValue: string = null;

  // tslint:disable-next-line: no-inferrable-types
  overlayVisible: boolean = false;

  documentClickListener: any;

  inputClick: boolean;

  inputKeyDown: boolean;

  timeout: NodeJS.Timer;

  loading: boolean;

  onModelChange: (_: any) => void;

  value: any;

  // tslint:disable-next-line: variable-name
  _suggestions: Array<any>;

  filled: boolean;

  highlightOption: any;

  noResults: boolean;

  suggestionsUpdated: boolean;

  highlightOptionChanged: boolean;

  forceSelectionUpdateModelTimeout: any;

  // tslint:disable-next-line: no-inferrable-types
  @Input() type: string = 'text';

  @Input() inputId: string;

  @Input() required: boolean;

  @Input() multiple: boolean;

  @Input() forceSelection: boolean;

  // tslint:disable-next-line: no-inferrable-types
  @Input() delay: number = 300;

  // tslint:disable-next-line: no-inferrable-types
  @Input() minLength: number = 1;

  // tslint:disable-next-line: no-inferrable-types
  @Input() immutable: boolean = true;

  @Input() autoHighlight: boolean;

  @Input() emptyMessage: string;

  @Input() field: string;

  @Input() dataKey: string;

  @Input() get suggestions(): Array<any> {
    return this._suggestions;
  }

  set suggestions(val: Array<any>) {
    this._suggestions = val;

    if (this.immutable) {
        this.handleSuggestionsChange();
    }
  }

  ngAfterViewChecked(): void {
    throw new Error('Method not implemented.');
  }
  ngAfterContentInit(): void {
    throw new Error('Method not implemented.');
  }
  ngDoCheck(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: (_: any) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  isSelected(val: any): boolean {
    let selected = false;
    if (this.value && this.value.length) {
        for (let i = 0; i < this.value.length; i++) {
            if (ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                selected = true;
                break;
            }
        }
    }
    return selected;
  }

  focusInput() {
    if (this.multiple) {
        this.multiInputEL.nativeElement.focus();
    } else {
        this.inputEL.nativeElement.focus();
    }
  }

  selectItem(option: any, focus: boolean = true) {
    if (this.forceSelectionUpdateModelTimeout) {
        clearTimeout(this.forceSelectionUpdateModelTimeout);
        this.forceSelectionUpdateModelTimeout = null;
    }

    if (this.multiple) {
        this.multiInputEL.nativeElement.value = '';
        this.value = this.value || [];
        if (!this.isSelected(option)) {
            this.value = [...this.value, option];
            this.onModelChange(this.value);
        }
    } else {
        this.inputEL.nativeElement.value = this.field ? ObjectUtils.resolveFieldData(option, this.field) || '' : option;
        this.value = option;
        this.onModelChange(this.value);
    }

    this.onSelect.emit(option);
    this.updateFilledState();

    if (focus) {
        this.focusInput();
    }
  }

  show() {
    if (this.multiInputEL || this.inputEL) {
        const hasFocus = this.multiple ? document.activeElement == this.multiInputEL.nativeElement : document.activeElement == this.inputEL.nativeElement ;

        if (!this.overlayVisible && hasFocus) {
            this.overlayVisible = true;
        }
    }
  }

  hide() {
    this.overlayVisible = false;
  }

  handleSuggestionsChange() {
    if (this._suggestions != null && this.loading) {
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


  onInputClick(event: MouseEvent) {
    if (this.documentClickListener) {
        this.inputClick = true;
    }
  }

  search(event: Event, query: string) {
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

  updateFilledState() {
    if (this.multiple) {
        this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
    } else {
        this.filled = (this.inputFieldValue && this.inputFieldValue != '') || (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '');
    }
  }

  onInput(event: Event) {
    if (!this.inputKeyDown) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const value = (event.target as HTMLInputElement).value;
    if (!this.multiple && !this.forceSelection) {
      this.onModelChange(value);
    }

    if (value.length === 0 && !this.multiple) {
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

  findOptionIndex(option): number {
    let index = -1;
    if (this.suggestions) {
        for (let i = 0; i < this.suggestions.length; i++) {
            if (ObjectUtils.equals(option, this.suggestions[i])) {
                index = i;
                break;
            }
        }
    }

    return index;
  }

  onKeydown(event) {
    if (this.overlayVisible) {
        const highlightItemIndex = this.findOptionIndex(this.highlightOption);

        switch (event.which) {
            // down
            case 40:
                if (highlightItemIndex !== -1) {
                    const nextItemIndex = highlightItemIndex + 1;
                    if (nextItemIndex !== (this.suggestions.length)) {
                        this.highlightOption = this.suggestions[nextItemIndex];
                        this.highlightOptionChanged = true;
                    }
                } else {
                    this.highlightOption = this.suggestions[0];
                }

                event.preventDefault();
                break;

            // up
            case 38:
                if (highlightItemIndex > 0) {
                    const prevItemIndex = highlightItemIndex - 1;
                    this.highlightOption = this.suggestions[prevItemIndex];
                    this.highlightOptionChanged = true;
                }

                event.preventDefault();
                break;

            // enter
            case 13:
                if (this.highlightOption) {
                    this.selectItem(this.highlightOption);
                    this.hide();
                }
                event.preventDefault();
                break;

            // escape
            case 27:
                this.hide();
                event.preventDefault();
                break;


            // tab
            case 9:
                if (this.highlightOption) {
                    this.selectItem(this.highlightOption);
                }
                this.hide();
                break;
        }
    } else {
        if (event.which === 40 && this.suggestions) {
            this.search(event, event.target.value);
        }
    }

    if (this.multiple) {
        switch (event.which) {
            // backspace
            case 8:
                if (this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                    this.value = [...this.value];
                    const removedValue = this.value.pop();
                    this.onModelChange(this.value);
                    this.updateFilledState();
                    this.onUnselect.emit(removedValue);
                }
                break;
        }
    }

    this.inputKeyDown = true;
  }

}
