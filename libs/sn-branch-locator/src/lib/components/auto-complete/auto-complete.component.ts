import { Component, OnInit, ViewChild, ElementRef, forwardRef, AfterViewChecked, AfterContentInit, DoCheck, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutoCompleteComponent ),
  multi: true
};

@Component({
  selector: 'sn-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR]
})
export class AutoCompleteComponent implements AfterViewChecked,AfterContentInit,DoCheck,OnDestroy,ControlValueAccessor {

  @ViewChild('in') inputEL: ElementRef<HTMLInputElement>;

  @ViewChild('ddBtn') dropdownButton: ElementRef;

  ngAfterViewChecked(): void {
    throw new Error("Method not implemented.");
  }
  ngAfterContentInit(): void {
    throw new Error("Method not implemented.");
  }
  ngDoCheck(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  writeValue(obj: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
  
}
