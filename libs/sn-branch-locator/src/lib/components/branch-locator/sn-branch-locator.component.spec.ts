import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';

import { AgmCoreModule, LatLngLiteral, MapsAPILoader, MarkerManager } from '@agm/core';
import { IconModule, OptionListModule, DrawerState,  DrawerModule} from 'sn-common-lib';

import { SnBranchInfoComponent } from '../sn-branch-info/sn-branch-info.component';

import { SnMarkerDirective } from '../../directives/sn-marker/sn-marker.directive';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';
import { TranslateModule } from '@ngx-translate/core';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { branchMock } from '../../helpers/branch.mock';
import { environment } from 'src/environments/environment';
import { ENV_CONFIG } from '@globile/mobile-services';
import { BranchSearchInputModule } from '../branch-search/branch-search.module';
import { FormBuilder } from '@angular/forms';

import { SnTabModule } from '../tabs/sn-tab.module';



const  mockMapsAPILoader = {
  load(): Promise<boolean> {
    return new Promise(() => {
      return true;
    });
  }
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
  },
  screen: {
    orientation: {

    }
  },
  navigator: {
    userAgent: ''
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
      imports: [
        DrawerModule,
        IconModule,
        SnTabModule,
        BranchSearchInputModule,
        OptionListModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: 'demo',
          libraries: ['places']
        })
      ],
      declarations: [
        SnBranchLocatorComponent,
        SnBranchInfoComponent,
      ],
      providers: [
        { provide: 'WINDOW', useValue: windowRef },
        { provide: GeoPositionService, useValue: GeoPositionServiceMock },
        { provide: MapsAPILoader, useValue: mockMapsAPILoader},
        { provide: ENV_CONFIG, useValue: environment },
        SnBranchLocatorService,
        FormBuilder,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
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
    placeChangeSpy =  spyOn<SnBranchLocatorComponent>(component, 'placeChange').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userPosition', () => {
    component.map = { api: {
      panTo: () => new Promise((panToresolve) => panToresolve()),
      setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
      getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
    }} as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    fixture.detectChanges();
    component.tilesLoaded();
    expect(component).toBeDefined();
  });

  it('map clicked reset with a selected branch', () => {
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker'] = new SnMarkerDirective({} as MarkerManager);
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker']['_markerManager'].updateIcon = () => null;
    component.mapClick();
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toBeUndefined();
  });


  it('map clicked reset without a selected branch', () => {
    // tslint:disable-next-line: no-string-literal
    component['selectedMarker'] = undefined;
    component.mapClick();
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
      {id: () => 1, clickable: true, iconUrl : undefined, _markerManager:  {updateIcon : () => undefined}},
      {id: () => 2, clickable: true, iconUrl : undefined, _markerManager: {updateIcon : () => undefined}},
      {id: () => 3, clickable: false, iconUrl : undefined, _markerManager: {updateIcon : () => undefined }}
    ] as any;
    const selected = {
      id: () => 1,
      clickable: true,
      iconUrl: undefined,
      _markerManager: {
        updateIcon: () => undefined,
        getNativeMarker: () => new Promise((resolve) => {
          resolve({ position: { lat: () => undefined, lng: () => undefined}});
        })
      }
    } as any;
    component.markerSelect(selected, branchMock);
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toEqual(selected);
  });


  it('place change', () => {
    component.map = { api: {
      panTo: () => new Promise((panToresolve) => panToresolve()),
      setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
      getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
    }} as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    const eventValue: LatLngLiteral = {lat: 9, lng: 33};
    component.placeChange(eventValue);
    expect(placeChangeSpy).toHaveBeenCalled();
  });

  it( 'should get optionalFullScreenControl value from default _optionalFullScreen value',  () => {
    component._optionalFullScreen = false;
    expect(component.optionalFullScreenControl).toBe(component._optionalFullScreen);
  } );

  it( 'should set optionalFullScreenControl value from property value', () => {
    component._optionalFullScreen = false;
    component.optionalFullScreenControl = true;
    expect(component._optionalFullScreen).toBe(true);
  } );
  it( 'should get optionalBranding value from default _optionalBranding value',  () => {
    component._optionalBranding = false;
    expect(component.optionalBranding).toBe(component._optionalBranding);
  } );

  it( 'should set optionalBranding value from property value', () => {
    component._optionalBranding = false;
    component.optionalBranding = true;
    expect(component._optionalBranding).toBe(true);
  } );

  describe('getBranchesByCoordinates()', () => {
    it('should return a list of branches', () => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component, 'selectBranch');
      component.getBranchesByCoordinates({lat: 1, lng: 2});
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith({lat: 1, lng: 2});
      expect(component.selectBranch).not.toHaveBeenCalled();
    });

    it('should call API with userPosition as param', () => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      component.userPosition = {lat: 2, lng: 3};
      component.getBranchesByCoordinates();
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith(component.userPosition);
    });

    it('should return error and set isLoading equal false', () => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.callFake(() => {
        return throwError(new Error('Fake error'));
      });
      component['branchService'].onChange.subscribe(() => {}, () => {
        expect(component.isLoading).toBeFalsy();
      });
      component.getBranchesByCoordinates();
    });

  });

  describe('centerMapToUser()', () => {
    beforeEach(() => {
      component.map = { api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }} as any;
    });

    it('should call getBranchesByCoordinates with params', () => {
      spyOn(component, 'getBranchesByCoordinates').and.returnValue(of([branchMock, branchMock]));
      component.userPosition = {lat: 38.7376049, lng: -9.1654431};
      component.centerMapToUser();
      expect(component.getBranchesByCoordinates).toHaveBeenCalledWith(component.userPosition, false);
    });

    it('should call selectBranch', () => {
      spyOn(component, 'selectBranch');
      component.branchesList = [branchMock];
      component.centerMapToUser(false, true);
      expect(component.selectBranch).toHaveBeenCalled();
      expect(component.showNearest).toBeTruthy();
    });
  });


  describe('tabsChanged()', () => {
    it('should set selectedTabIndex to 0', () => {
      component.tabsChanged({tabIndex: 0});
      expect(component['selectedTabIndex']).toBe(0);
    });
    it('should set selectedTabIndex to 1 and call clearSelectedMarker', () => {
      spyOn<any>(component, 'clearSelectedMarker');
      component.tabsChanged({tabIndex: 1});
      expect(component['selectedTabIndex']).toBe(1);
      expect(component['clearSelectedMarker']).toHaveBeenCalled();
    });
  });

  describe('mapReady()', () => {
    it('should set userPosition', () => {
      component.map = { api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }} as any;
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component['geoPosition'], 'getCurrentPosition').and.callThrough();
      component.mapReady();
      expect(component.userPosition).toBeDefined();
    });
  });


  describe('closeInfo()', () => {
    it('should return true', () => {
      component.showDrawer = false;
      component.closeInfo();
      expect(component.showDrawer).toBeTruthy();
    });
    it('should return false', () => {
      component.showDrawer = true;
      component.closeInfo();
      expect(component.showDrawer).toBeFalsy();
    });
  });

  it('onFilterApply() should set filterCounts to 1', () => {

    component.map = { api: {
      panTo: () => new Promise((panToresolve) => panToresolve()),
      setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
      getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
    }} as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    component.onFilterApply({count: 1});
    expect(component.filterCounts).toBe(1);
  });

  describe('showFilter()', () => {
    beforeEach(() => {
      component.filterView = {open: () => null} as any;
    });
    it('should call filterView.open', () => {
      spyOn(component.filterView, 'open');
      component.showFilter();
      expect(component.filterView.open).toHaveBeenCalled();
    });
  });

  describe('selectBranch()', () => {

    // const markerFound = this.branchMarkerList['_results'].find(marker => marker.title === branch.id);
    // this.markerSelected(markerFound, branch);
    // this.selectedTabIndex = 0;
    it('should call markerselect', () => {
      // component.branchMarkerList['_results'] = [{title: '1'}];
      spyOn(component, 'markerSelect').and.returnValue(null);
      // branchMock.id = '1';
      component.selectBranch(branchMock);
      expect(component.selectedTabIndex).toEqual(0);
    });
  });
});
