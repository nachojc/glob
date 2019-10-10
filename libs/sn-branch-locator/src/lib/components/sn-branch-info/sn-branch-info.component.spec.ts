import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionListModule, IconModule, SnTabModule } from 'sn-common-lib';

import { SnBranchInfoComponent } from './sn-branch-info.component';
import { Branch } from '../../models/branch.model';


const branchMock: Branch = {
  id: '5d8b6968048ccee51add3042',
  code: 'Santander_UK_UK_B798',
  entityCode: 'Santander_UK',
  name: 'Milton Keynes GG',
  action: null,
  poiStatus: 'ACTIVE',
  objectType: {
      multi: {
          default: 'BRANCH',
          es: 'BRANCH'
      },
      code: 'BRANCH'
  },
  subType: null,
  specialType: null,
  description: null,
  status: null,
  location: {
      type: 'Point',
      coordinates: [-0.77027524, 52.037222],
      address: 'Santander House, 201, Grafton Gate East, Milton Keynes, Buckinghamshire, MK9 1AN',
      zipcode: 'MK9 1AN',
      city: 'Milton Keynes',
      country: 'UK',
      locationDetails: null,
      parking: null,
      geoCoords: { latitude: 52.037222, longitude: -0.77027524},
      urlPhoto: null,
      descriptionPhoto: null
  },
  distanceInKm: 0.39915483283281106,
  distanceInMiles: 0.6386477325324977,
  contactData: null,
  socialData: {
      youtubeLink: 'https://www.youtube.com/user/UKSantander',
      facebookLink: 'https://www.facebook.com/santanderuk/',
      twitterLink: 'https://twitter.com/santanderuk',
      linkedinLink: 'https://www.linkedin.com/company/santander-uk-corporate-&-commercial',
      instagramLink: null,
      googleLink: null
  },
  appointment: {
      waitingTimeTeller: null,
      waitingTimeSpecialist: null,
      branchAppointment: 'https://www.santander.co.uk/uk/book-an-appointment'
  },
  schedule: {
      workingDay: {
        WEDNESDAY: ['09:30-17:00'],
        MONDAY: ['09:30-17:00'],
        THURSDAY: ['09:30-17:00'],
        SUNDAY: [],
        TUESDAY: ['09:30-17:00'],
        FRIDAY: ['09:30-17:00'],
        SATURDAY: []},
      specialDay: []
  },
  comercialProducts: [],
  banner: null,
  spokenlanguages: ['EN'],
  attrib: [],
  richTexts: [],
  people: null,
  events: null,
  store: '',
  urlDetailPage: '',
  dialogAttribute: null,
  updatedTime: 1569417528615,
  hideURLDetail: 'NO',
  poicode: 'B798'
};

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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchInfoComponent);
    component = fixture.componentInstance;
    component.branch = branchMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseHours()', () => {
    it('should return an array with one object', () => {
      // tslint:disable-next-line: no-string-literal
      expect(component['parseHours'](branchMock.schedule.workingDay).length).toBe(1);
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
      const result = component['parseHours'](branchMock.schedule.workingDay);

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
      expect(component['parseHours'](branchMock.schedule.workingDay).length).toBe(3);
    });
  });
});
