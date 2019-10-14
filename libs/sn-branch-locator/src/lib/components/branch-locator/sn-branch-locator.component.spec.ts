import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { AgmCoreModule, LatLngLiteral, MapsAPILoader, NoOpMapsAPILoader, MarkerManager, LatLngBounds } from '@agm/core';
import { IconModule, OptionListModule, SnTabModule } from 'sn-common-lib';
import { SnDrawerComponent } from '../sn-drawer/sn-drawer.component';
import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';
import { DrawerState } from '../sn-drawer/models/sn-drawer-state.model';
import { SnMarkerDirective } from '../../directives/sn-marker/sn-marker.directive';
import { BranchSearchInputModule } from '../branch-search-input';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Branch } from '../../models/branch.model';
import { of } from 'rxjs';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { tick } from '@angular/core/src/render3';
import { branchMock } from '../../helpers/branch.mock';


const MapsAPILoaderMock = {
  load: () => new Promise(() => true)
};
const windowRef = {
  google: {
    maps : {
      places: {
        Autocomplete : () => ({
          addListener: () => {},
          getPlace: () => ({geometry: null})
        })}
    }
  }
};
const mapBounds = {
  getNorthEast: () => ({
    lat: () => 123,
    lng: () => 123,
    toJSON: () => null
  }),
  getSouthWest: () => ({
    lat: () => 123,
    lng: () => 123,
    toJSON: () => null
  })
};


const GeoPositionServiceMock = {
  watchPosition: () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}}),
  getCurrentPosition : () => of({coords: {latitude: 38.7376049, longitude: -9.2654431}})
};


describe('SnBranchLocatorComponent', () => {
  let component: SnBranchLocatorComponent;
  let fixture: ComponentFixture<SnBranchLocatorComponent>;

  let placeChangeSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SnBranchLocatorComponent,
        SnDrawerComponent,
        SnBranchInfoComponent
      ],
      imports: [
        IconModule,
        SnTabModule,
        BranchSearchInputModule,
        OptionListModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: 'aaa'
        })
      ],
      providers: [
        { provide: 'WINDOW', useValue: windowRef },
        { provide: MapsAPILoader, useValue: MapsAPILoaderMock},
        { provide: GeoPositionService, useValue: GeoPositionServiceMock  },
        SnBranchLocatorService
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnBranchLocatorComponent);
    component = fixture.componentInstance;
    component.map = { api: {
      panTo: () => new Promise((panToresolve) => panToresolve()),
      setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
      getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
    }} as any;
    placeChangeSpy =  spyOn(component, 'placeChange').and.callThrough();
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

    fixture.detectChanges();
    expect(component.showReCenter).toEqual(true);
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


  it('place change', () => {
    const eventValue: LatLngLiteral = {lat: 9, lng: 33};

    component.placeChange(eventValue);
    expect(placeChangeSpy).toHaveBeenCalled();
  });

  describe('getBranchesByCoordinates()', () => {
    it('should return a list of branches', async(() => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      component.getBranchesByCoordinates({lat: 1, lng: 2});
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith({lat: 1, lng: 2});
    }));
  });

  it('tabsChanged() should set selectedTabIndex to 0', () => {
    component.tabsChanged({tabIndex: 0});
    expect(component['selectedTabIndex']).toBe(0);
  });
});
