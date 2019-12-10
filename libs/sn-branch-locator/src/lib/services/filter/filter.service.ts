import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { isObject, isNumber } from 'util';
import { FilterParams } from '../../models/default-view-request';


@Injectable({
  providedIn: 'root'
})
export class FilterService {

  public _filterCount: number = 0;
  private _previousValues: { [key: string]: any };
  private _filterParams: FilterParams;

  private _observer$ = new Subject<FilterParams>();
  public form: FormGroup;


  constructor(private fb: FormBuilder) { }


  /**
   * Initializes filter form and returns the form;
   */
  initForm(): FormGroup {
    if (!this.form) {
      this.form = this.fb.group({
        BRANCH: this.fb.group({
          SELECT: new FormControl(),
          BANCAPRIVADA: new FormControl(),
          PYME: new FormControl(),
          WORKCAFE: new FormControl(),
          EMPRESAS: new FormControl(),
          UNIVERSIDADES: new FormControl(),
          CLIENTES_POPULAR: new FormControl(),
          CLIENTES_PASTOR: new FormControl(),
          CLIENTES_BANEFE: new FormControl(),
          RESIDENTES: new FormControl(),
          GRANDES_SUPERFICIES: new FormControl(),
          AG_COLABORADORES: new FormControl(),
          AG_FINANCIEROS: new FormControl()
        }),
        ATM: this.fb.group({
          NON_SANTANDER_ATM: new FormControl(),
          ATM: new FormControl()
        }),
        CORRESPONSALES: this.fb.group({
          CORRESPONSALES: new FormControl(),
          ELEVEN: new FormControl(),
          CIRCLE_K: new FormControl(),
          TIENDA_EXTRA: new FormControl(),
          TIENDA_K: new FormControl(),
          TELECOMM: new FormControl(),
          SUPER7_24: new FormControl(),
          OXXO: new FormControl(),
        }),
      });
    }
    return this.form;
  }


  public get count(): number {
    return this._filterCount;
  }

  /**
   * Listens to when values are applied and returns the filter values
   */
  public get filterParamsChanges(): Observable<any> {
    return this._observer$.asObservable();
  }


  public get filterParams(): FilterParams {
    return this._filterParams;
  }


  public startFilter(): void {
    this.resetPreviousValues();
  }


  /**
   * Resets Count of checked filters
   */
  private resetActiveFilterCount(values: { [key: string]: any }): number {
    let count = 0;
    Object.keys(values).forEach((groupKey) => {
      if (isObject(values[groupKey])) {
        const group = values[groupKey];
        const counter = Object.keys(group).filter((filterKey) => group[filterKey]);
        if (counter && isNumber(counter.length)) {
          count += counter.length;
        }
      }
    });

    return count;
  }

  /**
   * Apply changes
   */
  public applyChanges(): void {
    this._filterCount = this.resetActiveFilterCount(this.form.value);
    this._filterParams = this.generateParams(this.form.value);
    this._observer$.next(this._filterParams);
    this._previousValues = this.form.value;
  }

  /**
   * Reset the form to previous stored values
   */
  private resetPreviousValues(): void {
    if (this._previousValues) {
      this.form.patchValue(this._previousValues);
      this.form.updateValueAndValidity();
    } else {
      this.form.reset();
    }
  }

  /**
   * Set Filters Enabled or Disabled based on a list of Markers
   */
  public enableFilters(markers: Array<any>): void {
    // TODO: // set filter to disable or enable based on Results
  }

  private generateParams(values: { [key: string]: any }): FilterParams {
    const filterSubType = new Array<string>();
    const filterType = new Array<string>();
    Object.keys(values).forEach((groupKey) => {
      if (isObject(values[groupKey])) {
        const group = values[groupKey];
        Object.keys(group).forEach((filterKey) => {
          if (group[filterKey]) {
            filterSubType.push(filterKey);
            if (!filterType.includes(groupKey)) {
              filterType.push(groupKey);
            }
          }
        });
      }
    });

    return { filterType: filterType.toString(), filterSubType: filterSubType.toString() };
  }
}
