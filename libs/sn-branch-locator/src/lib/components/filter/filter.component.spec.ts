import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FilterComponent} from './filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule, IconModule} from 'sn-common-lib';
import {FilterService} from '../../services/filter/filter.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('SnFilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IconModule,
        CheckboxModule,
        HttpClientTestingModule
      ],
      providers: [
        FilterService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).not.toBeUndefined();
  });


  it('on Open', () => {
    component.open();
    expect((component['el'].nativeElement as HTMLElement).style.display).not.toEqual('none');
  });


  it('on Close', () => {
    component.close();
    expect((component['el'].nativeElement as HTMLElement).style.display).toEqual('none');
  });


  it('on apply', () => {
    const spy = spyOn(component.filterApply, 'emit');
    component.apply();
    expect((component['el'].nativeElement as HTMLElement).style.display).toEqual('none');
    expect(spy).toHaveBeenCalled();
  });

  it('should display turn off button if a filter is selected', () => {
    const event = {
      source: {
        _uniqueId: 'sn-checkbox-1'
      },
      checked: true
    };
    component.selectedFilters = {};
    component.isHideTurnOffButton = true;
    component.selectFilter(event);
    expect(component.isHideTurnOffButton).toBe(false);
  });

  it('should hide turn off button when there is not a filter selected', () => {
    const event = {
      source: {
        _uniqueId: 'sn-checkbox-1'
      },
      checked: true
    };
    component.selectedFilters = {
      'sn-checkbox-1': {
        checked: true
      }
    };
    component.isHideTurnOffButton = true;
    component.selectFilter(event);
    expect(component.isHideTurnOffButton).toBeTruthy();
  });

  it('should be clean selectedFilters and set isHideTurnOffButton as true when switchFilterButton', () => {
    component.selectedFilters = {
      'sn-checkbox-1': {
        checked: true
      }
    };
    component.isHideTurnOffButton = false;
    component.clearFilters(new Event(''));
    expect(component.selectedFilters).toEqual({});
    expect(component.isHideTurnOffButton).toBeTruthy();
  });

});
