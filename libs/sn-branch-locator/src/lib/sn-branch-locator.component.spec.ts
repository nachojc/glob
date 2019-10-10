import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { AgmCoreModule, LatLngLiteral, MarkerManager } from '@agm/core';
import { SnBranchSearchInputComponent } from './components/sn-branch-search-input/sn-branch-search-input.component';
import { IconModule, OptionListModule, SnTabModule } from 'sn-common-lib';
import { SnDrawerComponent } from './components/sn-drawer/sn-drawer.component';
import { SnBranchInfoComponent } from './components/branch-locator/sn-branch-info/sn-branch-info.component';
import { DrawerState } from './components/sn-drawer/models/sn-drawer-state.model';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { BranchLocatorService } from './components/branch-locator/branch-locator.service';
import {  of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Branch } from './models/branch.model';


const BranchLocatorServiceMock = {
  watchPosition: () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}}),
  getCurrentPosition : () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}})
};

export const branchMock: Branch = {
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

describe('SnBranchLocatorComponent', () => {
  let component: SnBranchLocatorComponent;
  let fixture: ComponentFixture<SnBranchLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnBranchLocatorComponent, SnBranchSearchInputComponent, SnDrawerComponent, SnBranchInfoComponent],
      imports: [
        IconModule,
        SnTabModule,
        OptionListModule,
        HttpClientModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyCCOzVlRBrfWv06M6pHNtlkmcmuemXneAM'
        })
      ],
      providers: [{ provide: BranchLocatorService, useValue: BranchLocatorServiceMock  }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchLocatorComponent);
    component = fixture.componentInstance;
    component.map = { api: {panTo: (position) => undefined}} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('map clicked reset with a selected branch', () => {
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker'] = new SnMarkerDirective({} as MarkerManager);
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker'].markerManager.updateIcon = (aux) => null;
    component.mapClick({} as any);
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toBeUndefined();
  });


  it('map clicked reset without a selected branch', () => {
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker'] = undefined;
    component.mapClick({} as any);
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toBeUndefined();
  });

  it('call recenter map when user position is diferente from the center of the map', () => {
    component.userPosition = {lat: 38.7376049, lng: -9.2654431};
    const center: LatLngLiteral = {lat: 38.7376049, lng: -9.1654431};
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });

  it(`call recenter map when user position is undefined`, () => {
    component.userPosition = undefined;
    const center: LatLngLiteral = {lat: 38.7376049, lng: -9.1654431};
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });


  it('call recenter map when user position is equal to center of the map', () => {
    component.userPosition = {lat: 38.7376049, lng: -9.1654431};
    const center: LatLngLiteral = {lat: 38.7376049, lng: -9.1654431};
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });

  it('Drawer is Docked', () => {
    component.showDrawer = true;
    const state = DrawerState.Docked;
    component.drawerStageChange(state);
    expect(component.showDrawer).toBeTruthy();
  });

  it('Drawer is Bottom', () => {
    component.showDrawer = true;
    const state = DrawerState.Bottom;
    component.drawerStageChange(state);
    expect(component.showDrawer).not.toBeTruthy();
  });


  it('marker selected', () => {
    component.branchMarkerList = [
      {id: () => 1, clickable: true, iconUrl : undefined, markerManager:  {updateIcon : (marker: any) => undefined}},
      {id: () => 2, clickable: true, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined}},
      {id: () => 3, clickable: false, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined }}
    ] as any;
    const selected = {
      id: () => 1,
      clickable: true,
      iconUrl: undefined,
      markerManager: {
        updateIcon: (marker: any) => undefined,
        getNativeMarker: (marker: any) => new Promise((resolve) => {
          resolve({ position: { lat: () => undefined, lng: () => undefined}});
        })
      }
    } as any;
    component.markerSelected(selected, branchMock);
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toEqual(selected);
  });


  // it('reset markers', () => {
  //   component.branchMarkerList = [
  //     {id: () => 1, clickable: true, iconUrl : undefined, markerManager:  {updateIcon : (marker: any) => undefined}},
  //     {id: () => 2, clickable: true, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined}},
  //     {id: () => 3, clickable: false, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined }}
  //   ] as any;
  //   // tslint:disable-next-line: no-string-literal
  //   component['resetMarkers']();
  //   // tslint:disable-next-line: no-string-literal
  //   expect(component['selectedMarker']).toBeUndefined();
  // });


});
