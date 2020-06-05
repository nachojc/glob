import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IconModule, OptionListModule} from 'sn-common-lib';

import {SnBranchInfoComponent} from './sn-branch-info.component';
import {branchMock} from '../../helpers/branch.mock';
import {SnTabModule} from '../tabs/sn-tab.module';
import {HttpClientModule} from '@angular/common/http';

describe('SnBranchInfoComponent', () => {
  let component: SnBranchInfoComponent;
  let fixture: ComponentFixture<SnBranchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnBranchInfoComponent],
      imports: [
        SnTabModule,
        IconModule,
        OptionListModule,
        HttpClientModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('branch()', () => {
    it('should set isbranch as true', () => {
      expect(component.isBranch).toBeTruthy();
    });

    it('should set isbranch as false', () => {
      component.branch = Object.assign({}, branchMock, { objectType: { code: 'atm' } });
      expect(component.isBranch).toBeFalsy();
    });

    it('should define products and attributes', () => {
      component.branch = branchMock;
      expect(component.branch.attributes[0]).toEqual('Cash withdraw');
      expect(component.branch.attributes[1]).toEqual('CONTACTLESS');
      expect(component.branch.attributes[2]).toEqual('LOW_DENOMINATION_BILL');
      expect(component.branch.products[0]).toEqual('investment');
      expect(component.branch.hasAccesibility).toBeTruthy();
    });

    it('should define products and attributes for atm', () => {
      branchMock.atm = [Object.assign({}, branchMock, { objectType: { code: 'atm' } })];
      component.branch = branchMock;
      expect(component.branch.atm[0].attributes[0]).toEqual('Cash withdraw');
      expect(component.branch.atm[0].attributes[1]).toEqual('CONTACTLESS');
      expect(component.branch.atm[0].attributes[2]).toEqual('LOW_DENOMINATION_BILL');
      expect(component.branch.atm[0].products[0]).toEqual('investment');
      expect(component.branch.atm[0].hasAccesibility).toBeTruthy();
      expect(component.isBranch).toBeTruthy();
    });

    it('should return empty arrays for products and attributes', () => {
      branchMock.attrib = null;
      branchMock.comercialProducts = null;
      component.branch = branchMock;
      expect(component.branch.attributes.length).toBe(0);
      expect(component.branch.products.length).toBe(0);
    });
  });

  describe('parseSchedule()', () => {
    beforeEach(() => {
      component.branch = branchMock;
      component.language = 'en';
      fixture.detectChanges();
    });

    it('should return an array with one object', () => {
      // tslint:disable-next-line: no-string-literal
      expect(component['parseSchedule'](branchMock.schedule.workingDay).length).toBe(1);
    });


    it('should return an array with 3 objects', () => {
      branchMock.schedule.workingDay = {
        WEDNESDAY: ['09:30-17:00'],
        MONDAY: ['09:30-17:00'],
        THURSDAY: ['09:30-17:00'],
        SUNDAY: [],
        TUESDAY: ['09:00-12:00', '13:00-17:00'],
        FRIDAY: ['09:30-17:00'],
        SATURDAY: []
      };
      // tslint:disable-next-line: no-string-literal
      const result = component['parseSchedule'](branchMock.schedule.workingDay);
      expect(result.length).toBe(3);
      expect(result[0].text).toBe('Mon');
      expect(result[0].hours[0]).toBe('09:30-17:00');
      expect(result[1].text).toBe('Tue');
      expect(result[1].hours[0]).toBe('09:00-12:00');
      expect(result[2].text).toBe('Wed - Fri');
      expect(result[2].hours[0]).toBe('09:30-17:00');
    });

    it('should return an array with 3 objects', () => {
      branchMock.schedule.workingDay = {
        WEDNESDAY: ['09:30-17:00'],
        MONDAY: ['09:30-17:00'],
        THURSDAY: ['09:30-17:00'],
        SUNDAY: null,
        TUESDAY: ['09:00-12:00', '13:00-17:00'],
        FRIDAY: ['09:30-17:00'],
        SATURDAY: []
      };
      // tslint:disable-next-line: no-string-literal
      expect(component['parseSchedule'](branchMock.schedule.workingDay).length).toBe(3);
    });
  });

});
