import { TestBed } from '@angular/core/testing';

import { FilterService } from './filter.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('SnFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule],
    providers: [FilterService]
  }));

  it('should be created', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service).toBeTruthy();
  });

  it('initial count should be 0', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service.count).toEqual(0);
  });

  it('initial values should be undefined', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service.filterParams).toBeUndefined();
  });

  it('startFilter() should call form reset if no previous values', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
  });

  it('startFilter() should call form reset if no previous values', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
  });


  it('startFilter() should call form reset if no previous values', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
  });


  it('Apply filter selection and comeback with same values', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    const formpatchValueSpy =  spyOn(service.form, 'patchValue');
    const formupdateValueAndValidityValueSpy =  spyOn(service.form, 'updateValueAndValidity');
    service.initForm();
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
    service.form.get('BRANCH').get('SELECT').setValue(true);
    service.applyChanges();
    expect(formpatchValueSpy).not.toHaveBeenCalled();
    expect(formupdateValueAndValidityValueSpy).toHaveBeenCalled();
    service.startFilter();
    expect(service.filterParams).not.toBeUndefined();
    expect(service.form.get('BRANCH').get('SELECT').value).toBeTruthy();
    expect(service.count).toEqual(0);
  });


  it('Cancel filter selection', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    service.initForm();
    service.startFilter();
    service.form.get('BRANCH').get('SELECT').setValue(true);
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
    expect(service.count).toEqual(0);
    expect(service.filterParams).toBeUndefined();
  });


  it('filter stores selection', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.initForm();
    const formResetSpy =  spyOn(service.form, 'reset');
    service.initForm();
    service.startFilter();
    service.form.get('BRANCH').get('SELECT').setValue(true);
    service.startFilter();
    service.applyChanges();
    service.form.get('BRANCH').get('SELECT').setValue(false);
    service.startFilter();
    expect(formResetSpy).toHaveBeenCalled();
    expect(service.count).toEqual(1);
    expect(service.filterParams).not.toBeUndefined();
  });

  it('enableFilters', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.enableFilters({}as any);
  });

});
