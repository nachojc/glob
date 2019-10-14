import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class FilterService {

  private _filterCount: number = 0;
  private _hasChanges: boolean;
  private _previousValues: { [key: string]: any; };

  private applyedFiltersSubject = new BehaviorSubject<{ [key: string]: any; }>({});
  public form: FormGroup;

  constructor(private fb: FormBuilder) {

  }


  /**
   * Initialises filter form and returns the form;
   */
  initForm(): FormGroup {
    if (!this.form) {
      this.form = this.fb.group({
        personal: new FormControl(),
        openAfternoons: new FormControl(),
        workCafe: new FormControl(),
        privateBanking: new FormControl(),
        smeBusiness: new FormControl(),
        popularPastor: new FormControl(),
        partners: new FormControl(),
        santanderAtms: new FormControl(),
        otherAtms: new FormControl(),
        withdrawal: new FormControl(),
        withdrawWithoutCard: new FormControl(),
        deposit: new FormControl(),
        pay: new FormControl(),
        cardIssuanceInstantly: new FormControl(),
        availableNow: new FormControl(),
        openAfternoonsAdditional: new FormControl(),
        openSaturdays: new FormControl(),
        noCommissions: new FormControl(),
        lowDenominationBanknotes: new FormControl(),
        ownParking: new FormControl(),
        wheelchairAccessibility: new FormControl(),
        audioGuidance: new FormControl(),
        coWorkingSpaces: new FormControl(),
        wiFi: new FormControl(),
        securityBoxes: new FormControl(),
        driveThru: new FormControl(),
      });
    }
    return this.form;
  }


  public get count(): number {
    return this._filterCount;
  }

  /**
   * Listens to when values are applyed and returns the filter values
   */
  public get valueChanges(): Observable<any> {
    return this.applyedFiltersSubject.asObservable();
  }


  public get values(): { [key: string]: any } {
    return this._previousValues;
  }


  public startFilter(): void {
    this._hasChanges = false;
    this.resetPreviousValues();
  }


  /**
   * Resets Count of checked filters
   */
  private resetActiveFilterCount(values): void {
    const counter = Object.keys(values).filter((key) => values[key]);
    if (counter && counter.length) {
      this._filterCount = counter.length;
    } else {
      this._filterCount = 0;
    }
  }

  /**
   * Applys changes
   */
  public applyChanges(): void {
    this._previousValues = this.form.value;
    this.resetActiveFilterCount(this._previousValues);
    this.applyedFiltersSubject.next(this._previousValues);
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


}
