import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionListModule, IconModule, SnTabModule } from 'sn-common-lib';

import { SnBranchInfoComponent } from './sn-branch-info.component';
import { branchMock } from '../../helpers/branch.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('SnBranchInfoComponent', () => {
  let component: SnBranchInfoComponent;
  let fixture: ComponentFixture<SnBranchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnBranchInfoComponent ],
      imports: [
        SnTabModule,
        IconModule,
        OptionListModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchInfoComponent);
    component = fixture.componentInstance;
    component.branch = branchMock;
    fixture.detectChanges();
    component.language = 'en';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseHours()', () => {
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
