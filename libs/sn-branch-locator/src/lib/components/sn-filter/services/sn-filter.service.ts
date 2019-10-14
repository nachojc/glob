import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { isObject, isNumber } from 'util';
import { FilterParams } from '../../../models/default-view-request';

@Injectable()
export class FilterService {

  private _filterCount: number = 0;
  private _hasChanges: boolean;
  private _previousValues: { [key: string]: any; };
  private _filterParams: FilterParams;

  private appliedFiltersSubject = new BehaviorSubject<{ [key: string]: any; }>({});
  public form: FormGroup;


  constructor(private fb: FormBuilder) {

  }


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
    return this.appliedFiltersSubject.asObservable();
  }


  public get filterParams(): FilterParams {
    return this._filterParams;
  }


  public startFilter(): void {
    this._hasChanges = false;
    this.resetPreviousValues();
  }


  /**
   * Resets Count of checked filters
   */
  private resetActiveFilterCount(values): void {
    this._filterCount = 0;
    Object.keys(values).forEach((groupKey) => {
      if (isObject(values[groupKey])) {
        const group = values[groupKey];
        const counter = Object.keys(group).filter((filterKey) => group[filterKey]);
        if (counter && isNumber(counter.length)) {
          this._filterCount += counter.length;
        }
      }
    });
  }

  /**
   * Apply changes
   */
  public applyChanges(): void {
    this._previousValues = this.form.value;
    this.resetActiveFilterCount(this._previousValues);
    this.generateParams(this._previousValues);
    this.appliedFiltersSubject.next(this._filterParams);
    this._hasChanges = true;
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

  private generateParams(values): void {
    const filterSubType = new Array<string>();
    const filterType = new Array<string>();
    this._filterCount = 0;
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

    this._filterParams = { filterType: filterType.toString(), filterSubType: filterSubType.toString() };
  }


}
