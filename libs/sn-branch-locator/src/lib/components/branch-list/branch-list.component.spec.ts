import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { BranchListComponent } from './branch-list.component';
import { Branch } from '../../models/branch.model';
import {
  IconModule,
  OptionListModule,
  LoaderModule
} from 'sn-common-lib';
import { DebugElement, SimpleChanges, SimpleChange } from '@angular/core';


const mockBranchList: Branch = {
  id: '5e3aa07e9df0c71d821de18c',
  code: 'Santander_ESP_ES_6863000464',
  entityCode: 'Santander_ESP',
  name: null,
  action: null,
  poiStatus: 'ACTIVE',
  objectType: {
    multi:
    {
      default: 'CAJERO',
      es: 'CAJERO'
    },
    code: 'ATM'
  },
  subType: {
    multi: '',
    code: 'NON_SANTANDER_ATM'
  },
  specialType: '',
  description: null,
  status: null,
  location: {
    type: 'Point',
    coordinates: [-3.810933,
      40.455844],
    address: 'C/ ENRIQUE GRANADOS,' +
      ' 1',
    zipcode: '28223',
    city: 'POZUELO DE ALARCON',
    country: 'ES',
    locationDetails: null,
    parking: null,
    geoCoords: {
      latitude: 40.455844,
      longitude: -3.810933
    },
    urlPhoto: null,
    descriptionPhoto: null
  },
  distanceInKm: 0.73,
  distanceInMiles: 0.45,
  contactData: null,
  socialData: null,
  appointment: {
    waitingTimeTeller: null,
    waitingTimeSpecialist: null,
    branchAppointment: null
  },
  schedule: {
    workingDay: {
      WEDNESDAY: [],
      MONDAY: [],
      THURSDAY: [],
      SUNDAY: [],
      TUESDAY: [],
      FRIDAY: [],
      SATURDAY: []
    },
    specialDay: []
  },
  comercialProducts: [{
    default: 'BILLETES DE: 20-50',
    es: 'BILLETES DE: 20-50'
  }],
  banner: null,
  spokenlanguages: null,
  attrib: [{
    multi: {
      default: 'SI',
      es: 'SI'
    },
    code: 'WITHDRAW'
  }],
  richTexts: [{
    multi: {
      default: 'Cajero Interior',
      es: 'Cajero Interior'
    },
    code: ''
  }],
  people: null,
  events: null,
  store: 'POIBean [id=null,' +
    ' code=Santander_ESP_ES_6863000464,' +
    ' entityCode=Santander_ESP,' +
    ' POICode=6863000464,' +
    ' name=null,' +
    ' action=null,' +
    ' poiStatus=ACTIVE,' +
    ' objectType=SimpleMultiDataID [code=ATM] {default=CAJERO,' +
    ' es=CAJERO},' +
    ' subType=SimpleMultiDataID [code=NON_SANTANDER_ATM] {default=CAJERO NO SANTANDER,' +
    ' es=CAJERO NO SANTANDER},' +
    ' specialType=SimpleMultiDataID [code=POPULAR-EURO AUTOMATIC CASH] {},' +
    ' description=null,' +
    ' status=null,' +
    ' location=Location [type=Point,' +
    ' coordinates=[-3.810933,' +
    ' 40.455844],' +
    ' address=C/ ENRIQUE GRANADOS,' +
    ' 1,' +
    ' zipcode=28223,' +
    ' city=POZUELO DE ALARCON,' +
    ' country=ES,' +
    ' locationDetails=null,' +
    ' parking=null,' +
    ' geoCoords=null,' +
    ' urlPhoto=null,' +
    ' descriptionPhoto=null],' +
    ' distanceInKm=0.0,' +
    ' distanceInMiles=0.0,' +
    ' contactData=nullSocialData null,' +
    ' comercialProducts=[{default=BILLETES DE: 20-50,' +
    ' es=BILLETES DE: 20-50}],' +
    ' banner=null,' +
    ' spokenlanguages=null,' +
    ' attrib=[SimpleMultiDataID [code=WITHDRAW] {default=SI,' +
    ' es=SI}],' +
    ' people=null,' +
    ' events=null,' +
    ' urlDetailPage=https://locations.santander.com/es/santander-esp/pozuelo-de-alarcon/c-enrique-granados-1-2/,' +
    ' richTexts=[SimpleMultiDataID [code=] {default=Cajero Interior,' +
    ' es=Cajero Interior}],' +
    ' richTexts=Wed Feb 05 10:58:07 GMT 2020 hideURLDetail=NO]',
  urlDetailPage: 'https://locations.santander.com/es/santander-esp/pozuelo-de-alarcon/c-enrique-granados-1-2/',
  dialogAttribute: null,
  updatedTime: 1580900287091,
  hideURLDetail: 'NO',
  poicode: '6863000464',
  distanceDone: true
};
describe('BranchListComponent', () => {
  let component: BranchListComponent;
  let fixture: ComponentFixture<BranchListComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BranchListComponent],
      imports: [IconModule, OptionListModule, LoaderModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load more results', () => {
    component.branchesList = [];
    const spy = spyOn(component, 'loadMoreResults').and.callThrough();
    component.loadMoreResults();
    expect(spy).toHaveBeenCalled();
  });
  it('should increment load more variable', () => {
    component.branchesList = [
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList, mockBranchList,
      mockBranchList, mockBranchList];
    const spy = spyOn(component, 'loadMoreResults').and.callThrough();
    component.loadMoreResults();
    expect(component.maxBranchesToLoad).toBeGreaterThan(10);
  });

  it('should show loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const mainElement: HTMLElement = fixture.debugElement.nativeElement;
    const snOptionList: HTMLElement = mainElement.querySelector('sn-option-list');

    expect(mainElement.querySelector('sn-loader')).toBeDefined();
    expect(snOptionList.style.display).toEqual('none');
  });

  it('should hide loading', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const mainElement: HTMLElement = fixture.debugElement.nativeElement;
    const snOptionList: HTMLElement = mainElement.querySelector('sn-option-list');

    expect(mainElement.querySelector('sn-loader')).toBeNull();
    expect(snOptionList.style.display).not.toEqual('none');
  });

  describe('ngOnChanges()', () => {
    it('should maxBranchesToLoad to be reset when branch list change with numberOfBranchesToLoad', () => {
      const changes = {
        branchesList: {
          previousValue: [mockBranchList],
          currentValue: [mockBranchList, mockBranchList, mockBranchList],
          firstChange: false
        } as SimpleChange
      } as SimpleChanges;
      component.branchesList = [mockBranchList];
      fixture.detectChanges();
      component.ngOnChanges(changes);
      expect(component.maxBranchesToLoad).toBe((component as any).numberOfBranchesToLoad);
    });

    it('shouldn`t maxBranchesToLoad to be reset when branch list doesn`t change', () => {
      const changes = {
        branchesList: undefined
      } as SimpleChanges;
      component.branchesList = [
        mockBranchList, mockBranchList, mockBranchList,
        mockBranchList, mockBranchList, mockBranchList,
        mockBranchList, mockBranchList, mockBranchList,
        mockBranchList, mockBranchList, mockBranchList];
      fixture.detectChanges();
      component.ngOnChanges(changes);
      const isMaxBranchesToLoadReset = component.maxBranchesToLoad === (component as any).numberOfBranchesToLoad ? false : true;
      expect(isMaxBranchesToLoadReset).toBeFalsy();
    });
  });

  describe('selectBranch()', () => {
    it('should emit branchSelected on selectBranch call', () => {
      const spy = spyOn<any>(component.branchSelected, 'emit');
      component.selectBranch(mockBranchList);
      expect(spy).toHaveBeenCalled();
    });
  });
});
