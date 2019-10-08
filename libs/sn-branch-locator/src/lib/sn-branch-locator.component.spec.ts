import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { AgmCoreModule, LatLngLiteral } from '@agm/core';
import { SnTabModule } from './components/tabs/sn-tab.module';
import { IconModule } from 'sn-common-lib';
import { SnDrawerComponent } from './components/sn-drawer/sn-drawer.component';
import { SnBranchInfoComponent } from './components/branch-locator/sn-branch-info/sn-branch-info.component';
import { DrawerState } from './components/sn-drawer/models/sn-drawer-state.model';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { BranchLocatorService } from './components/branch-locator/branch-locator.service';
import {  of } from 'rxjs';
import { BranchSearchInputModule } from './components/branch-search-input';


const BranchLocatorServiceMock = {
  watchPosition: () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}}),
  getCurrentPosition : () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}})
};

describe('SnBranchLocatorComponent', () => {
  let component: SnBranchLocatorComponent;
  let fixture: ComponentFixture<SnBranchLocatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnBranchLocatorComponent, SnDrawerComponent, SnBranchInfoComponent],
      imports: [
        IconModule,
        SnTabModule,
        BranchSearchInputModule,
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
    component['selectedBranch'] = {} as SnMarkerDirective;
    component.mapClick({} as any);

    expect(component['selectedBranch']).toBeUndefined();
  });


  it('map clicked reset with out a selected branch', () => {
    component['selectedBranch'] = undefined;
    component.mapClick({} as any);

    expect(component['selectedBranch']).toBeUndefined();
  });

  it('call recenter map when user position is diferente from the center of the map', () => {
    component.userPostion = {lat: 38.7376049, lng: -9.2654431};
    const center: LatLngLiteral = {lat: 38.7376049, lng: -9.1654431};
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });

  it(`call recenter map when user position is undefined`, () => {
    component.userPostion = undefined;
    const center: LatLngLiteral = {lat: 38.7376049, lng: -9.1654431};
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });


  it('call recenter map when user position is equal to center of the map', () => {
    component.userPostion = {lat: 38.7376049, lng: -9.1654431};
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
    component.markerSelected(selected);

    expect(component['selectedBranch']).toEqual(selected);
  });


  it('reset markers', () => {
    component.branchMarkerList = [
      {id: () => 1, clickable: true, iconUrl : undefined, markerManager:  {updateIcon : (marker: any) => undefined}},
      {id: () => 2, clickable: true, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined}},
      {id: () => 3, clickable: false, iconUrl : undefined, markerManager: {updateIcon : (marker: any) => undefined }}
    ] as any;

    component['resetMarkers']();

    expect(component['selectedBranch']).toBeUndefined();
  });


});
