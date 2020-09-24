import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SnBranchLocatorComponent} from './sn-branch-locator.component';

import {AgmCoreModule, LatLngLiteral, MapsAPILoader} from '@agm/core';
import {DrawerModule, DrawerState, IconModule, OptionListModule} from 'sn-common-lib';

import {SnBranchInfoComponent} from '../sn-branch-info/sn-branch-info.component';

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {GeoPositionService} from '../../services/geo-position/geo-position.service';
import {SnBranchLocatorService} from '../../services/branch-locator/branch-locator.service';
import {branchMock} from '../../helpers/branch.mock';
import {environment} from 'src/environments/environment';
import {BranchSearchInputModule} from '../branch-search/branch-search.module';
import {FormBuilder} from '@angular/forms';

import {SnTabModule} from '../tabs/sn-tab.module';
import {SnDirectionModule} from '../../directives/sn-direction/sn-direction.module';
import {OutputDirection} from '../../models/output-direction';


const mockMapsAPILoader = {
  load(): Promise<boolean> {
    return new Promise(() => {
      return true;
    });
  }
};

const windowRef = {
  google: {
    maps: {
      places: {
        Autocomplete: () => ({
          addListener: () => { },
          getPlace: () => ({ geometry: null })
        })
      }
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
  watchPosition: () => of({ coords: { latitude: 38.7376049, longitude: -9.2654431 } }),
  getCurrentPosition: () => of({ coords: { latitude: 38.7376049, longitude: -9.2654431 } }),
  getPositionByText: () => of({ coords: { latitude: 38.7376049, longitude: -9.2654431 } })
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
        AgmCoreModule.forRoot({
          apiKey: 'demo',
          libraries: ['places']
        }),
        SnDirectionModule,
      ],
      declarations: [
        SnBranchLocatorComponent,
        SnBranchInfoComponent,
      ],
      providers: [
        { provide: 'WINDOW', useValue: window },
        { provide: 'ENV_CONFIG', useValue: environment },
        { provide: GeoPositionService, useValue: GeoPositionServiceMock },
        { provide: MapsAPILoader, useValue: mockMapsAPILoader },
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
    component.map = {
      api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }
    } as any;
    placeChangeSpy = spyOn<SnBranchLocatorComponent>(component, 'placeChange').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userPosition', () => {
    component.map = {
      api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }
    } as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    fixture.detectChanges();
    component.tilesLoaded();
    expect(component).toBeDefined();
  });

  it('call recenter map when user position is diferente from the center of the map', () => {
    component.userPosition = { lat: 38.7376049, lng: -9.2654431 };
    const center: LatLngLiteral = { lat: 38.7376049, lng: -9.1654431 };
    component.centerChange(center);

    fixture.detectChanges();
    expect(component.showReCenter).toEqual(true);
  });

  it(`call recenter map when user position is undefined`, () => {
    component.userPosition = undefined;
    const center: LatLngLiteral = { lat: 38.7376049, lng: -9.1654431 };
    component.centerChange(center);
    expect(component.showReCenter).not.toBeTruthy();
  });


  it('call recenter map when user position is equal to center of the map', () => {
    component.userPosition = { lat: 38.7376049, lng: -9.1654431 };
    const center: LatLngLiteral = { lat: 38.7376049, lng: -9.1654431 };
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
      { id: () => 1, clickable: true, iconUrl: undefined, _markerManager: { updateIcon: () => undefined } },
      { id: () => 2, clickable: true, iconUrl: undefined, _markerManager: { updateIcon: () => undefined } },
      { id: () => 3, clickable: false, iconUrl: undefined, _markerManager: { updateIcon: () => undefined } }
    ] as any;
    const selected = {
      id: () => 1,
      clickable: true,
      iconUrl: undefined,
      _markerManager: {
        updateIcon: () => undefined,
        getNativeMarker: () => new Promise((resolve) => {
          resolve({ position: { lat: () => undefined, lng: () => undefined } });
        })
      }
    } as any;
    component.filterView = { open: () => null, isOpen: () => true, toggle: () => true } as any;
    component.markerSelect(selected, branchMock, false);
    // tslint:disable-next-line: no-string-literal
    expect(component['selectedMarker']).toEqual(selected);
  });


  it('place change', () => {
    component.map = {
      api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }
    } as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    const eventValue: LatLngLiteral = { lat: 9, lng: 33 };
    component.placeChange(eventValue);
    expect(placeChangeSpy).toHaveBeenCalled();
  });

  it('should get coordinates value input', () => {
    (component as any)._coordinates = 'lng:12,lat:23';
    expect(component.coordinates).toBe((component as any)._coordinates);
  });

  it('should set coordinates value from property value', () => {
    (component as any)._coordinates = '';
    component.coordinates = 'lng:12,lat:23';
    expect((component as any).coordinates).toBe('lng:12,lat:23');
  });

  it('should get address value input', () => {
    (component as any)._address = 'Calle Madrid';
    expect(component.address).toBe((component as any)._address);
  });

  it('should set address value from property value', () => {
    (component as any)._address = '';
    component.address = 'Calle Oviedo';
    expect((component as any).address).toBe('Calle Oviedo');
  });

  it('should set address value from property value', () => {
    (component as any)._address = 'Calle Alcala';
    expect(component.address).toBe('Calle Alcala');
  });

  it('should get optionalFullScreenControl value from default _optionalFullScreen value', () => {
    (component as any)._optionalFullScreen = false;
    expect(component.optionalFullScreenControl).toBe((component as any)._optionalFullScreen);
  });

  it('should set optionalFullScreenControl value from property value', () => {
    (component as any)._optionalFullScreen = false;
    component.optionalFullScreenControl = true;
    expect((component as any)._optionalFullScreen).toBe(true);
  });

  describe('getBranchesByCoordinates()', () => {
    it('should return a list of branches', () => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component, 'selectBranch');
      component.getBranchesByCoordinates({ lat: 1, lng: 2 });
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith({ lat: 1, lng: 2 });
      expect(component.selectBranch).not.toHaveBeenCalled();
    });

    it('should return a list of branched regarding user position', () => {
      const userPosition = {
        lat: 34,
        lng: -3.4
      };
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component, 'selectBranch');
      component.userPosition = userPosition;
      component.getBranchesByCoordinates(null);
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith(userPosition);
      expect(component.selectBranch).not.toHaveBeenCalled();
    });

    it('should call API with userPosition as param', () => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      component.userPosition = { lat: 2, lng: 3 };
      component.getBranchesByCoordinates();
      expect(component['branchService'].getBranchesByCoords).toHaveBeenCalledWith(component.userPosition);
    });

    it('should return error and set isLoading equal false', done => {
      spyOn(component['branchService'], 'getBranchesByCoords').and.callFake(() => {
        return throwError(new Error('Fake error'));
      });
      // TODO: Mock the service
      // component['branchService'].onChange.subscribe(() => { }, () => {
      //   expect(component.isLoading).toBeFalsy();
      //   done();
      // });
      // component.getBranchesByCoordinates();
      done();
      expect().nothing();
    });

  });

  describe('centerMapToUser()', () => {
    beforeEach(() => {
      component.map = {
        api: {
          panTo: () => new Promise((panToresolve) => panToresolve()),
          setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
          getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
        }
      } as any;
    });

    it('should call getBranchesByCoordinates with params', () => {
      spyOn(component, 'getBranchesByCoordinates').and.returnValue(of([branchMock, branchMock]));
      component.userPosition = { lat: 38.7376049, lng: -9.1654431 };
      component.startingPosition = { coordinates: { lat: 38.7376049, lng: -9.1654431 } };
      component.centerMapToUser(true, false);
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
      component.tabsChanged({ tabIndex: 0 });
      expect(component['selectedTabIndex']).toBe(0);
    });
    it('should set selectedTabIndex to 1 and call clearSelectedMarker', () => {
      spyOn<any>(component, 'clearSelectedMarker');
      component.tabsChanged({ tabIndex: 1 });
      expect(component['selectedTabIndex']).toBe(1);
      expect(component['clearSelectedMarker']).toHaveBeenCalled();
    });
  });

  describe('mapReady()', () => {
    it('should set userPosition by only text in starting position', () => {
      component.map = {
        api: {
          panTo: () => new Promise((panToresolve) => panToresolve()),
          setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
          getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
        }
      } as any;
      component.startingPosition = {
        text: 'Calle Oviedo'
      };
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component['geoPosition'], 'getCurrentPosition').and.callThrough();
      component.mapReady();
      expect(component.userPosition).toBeDefined();
    });

    it('should set userPosition by only coordinates in starting position', () => {
      component.map = {
        api: {
          panTo: () => new Promise((panToresolve) => panToresolve()),
          setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
          getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
        }
      } as any;
      component.startingPosition = {
        coordinates: { lat: 10, lng: 3 }
      };
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component['geoPosition'], 'getCurrentPosition').and.callThrough();
      component.mapReady();
      expect(component.userPosition).toBeDefined();
    });

    it('should set userPosition by geolocation if no text or coordinates provided', () => {
      component.map = {
        api: {
          panTo: () => new Promise((panToresolve) => panToresolve()),
          setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
          getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
        }
      } as any;
      component.startingPosition = {
      };
      spyOn(component['branchService'], 'getBranchesByCoords').and.returnValue(of([branchMock, branchMock]));
      spyOn(component['geoPosition'], 'getCurrentPosition').and.callThrough();
      component.mapReady();
      expect(component.userPosition).toBeDefined();
    });
  });

  describe('closeInfo()', () => {
    const map = {
      api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }
    } as any;

    it('should return true', () => {
      component.map = map;
      component.showDrawer = false;
      component.isVisibleRoute = false;
      component.isVisibleMarkers = true;
      component.closeInfo();
      expect(component.showDrawer).toBeTruthy();
    });

    it('should return false', () => {
      component.map = map;
      component.showDrawer = true;
      component.isVisibleRoute = false;
      component.isVisibleMarkers = true;
      component.closeInfo();
      expect(component.showDrawer).toBeFalsy();
    });
  });

  it('onFilterApply() should set filterCounts to 1', () => {

    component.map = {
      api: {
        panTo: () => new Promise((panToresolve) => panToresolve()),
        setZoom: () => new Promise((setZoomresolve) => setZoomresolve()),
        getBounds: () => new Promise((getBoundsresolve) => getBoundsresolve(mapBounds))
      }
    } as any;
    spyOn(component['branchService'], 'getBranchesByBounds').and.returnValue(of([branchMock, branchMock]));
    component.onFilterApply({ count: 1 });
    expect(component.filterCounts).toBe(1);
  });

  describe('showFilter()', () => {
    beforeEach(() => {
      component.filterView = { open: () => null, isOpen: () => true } as any;
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

  describe('closeDirectionsPanel()', () => {
    it('should set show directions panel to false, clear routes and call openDrawer', () => {
      const spy = spyOn<any>((component as any), 'openDrawer');
      component.isVisibleRoute = true;
      component.isVisibleMarkers = false;
      component.closeDirectionsPanel();
      expect(component.showDirectionsPanel).toBeFalsy();
      expect(component.isVisibleMarkers).toBe(true);
      expect(component.isVisibleRoute).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('openDirectionsPanel()', () => {
    it('should set show directions panel to true', () => {
      component.openDirectionsPanel();
      expect(component.showDirectionsPanel).toBeTruthy();
    });
  });

  describe('onDirectionsResponse()', () => {
    it('should build routes with event values on directions response', fakeAsync(() => {
      const event = {
        routes: [
          {
            legs: [
              {
                steps: [{
                  instructions: '',
                  distance: {
                    text: ''
                  },
                  duration: {
                    text: ''
                  },
                  maneuver: ''
                }]
              }
            ],
            push: () => { }
          },
        ]
      };
      const routes = [{
        id: 1,
        instructions: '',
        distance: '',
        time: '',
        maneuver: ''
      }];

      component.routes = [];
      component.onDirectionsResponse(event);
      tick(500);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.routes).toEqual(routes);
      });
    }));
  });

  describe('drawDirections()', () => {
    it('should set destination and origin coords, travel mode and display visible route plus hide markers', () => {
      const branchDirection = {
        geoCoords: {
          latitude: 48,
          longitude: -3.5
        },
        travelMode: 'DRIVING'
      } as OutputDirection;
      const destination = {
        lat: 48,
        lng: -3.5,
      };
      const userPosition = {
        lat: 10,
        lng: 10
      };
      component.userPosition = userPosition;
      component.travelMode = '';
      component.isVisibleRoute = false;
      component.isVisibleMarkers = true;
      component.drawDirections(branchDirection);
      expect(component.destination).toEqual(destination);
      expect(component.origin).toEqual(userPosition);
      expect(component.isVisibleRoute).toBeTruthy();
      expect(component.isVisibleMarkers).toBeFalsy();
    });
  });

  describe('clearSelectedMarker()', () => {
    it('should clean selected marker and selected branch if selected marker is already defined', () => {
      const selectedMarker = {
        iconUrl: {},
        _markerManager: {
          updateIcon: () => { }
        }
      };
      const branchIcon = {
        url: '',
        scaledSize: {
          height: 40,
          width: 40
        },
        anchor: {
          x: 8,
          y: 8
        }
      };
      component.branchIcon = branchIcon;
      (component as any).selectedMarker = selectedMarker;
      (component as any).clearSelectedMarker();
      expect((component as any).selectedMarker).toBeUndefined();
      expect(component.selectedBranch).toBeUndefined();
    });
  });

  describe('openMenu()', () => {
    it('should open menu component when menu is already closed and it exists', () => {
      const menuComponent = {
        currentState: 'menuClosed',
        open: () => { }
      };
      (component as any).menuComponent = menuComponent;
      const spy = spyOn<any>((component as any).menuComponent, 'open');
      component.openMenu();
      expect(spy).toHaveBeenCalled();
    });
  });
});
