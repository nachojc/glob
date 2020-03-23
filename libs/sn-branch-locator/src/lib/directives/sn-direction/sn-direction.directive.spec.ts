import { SnDirectionDirective } from './sn-direction.directive';
import { Component, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { GoogleMap} from '@agm/core/services/google-maps-types';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

@Component({
  template: `
    <sn-direction></sn-direction>
  `
}) class TestSnDirectionComponent {
  @ViewChild('sn-direction', { static: false }) public directionDirective: SnDirectionDirective;
}

class MockGoogleMapsClass {
  constructor() { }
  public setMap() { }
  public addListener() { }
  public setPanel() { }
  public route() { }
}

const mockDirectionsDisplay = {
  setPanel: () => { },
  setMap: () => { },
  setDirections: () => { }
};

const mockResponse = {
  routes: [
    {
      legs: [{
        start_location: '',
        start_address: '',
        end_location: '',
        end_address: '',
        via_waypoints: []
      }]
    }
  ]
};

const mockOriginMarker = {
  setMarker: () => { },
  setMap: () => { }
};

const mockDestinationMarker = {
  setMarker: () => { },
  setMap: () => { }
};

const mockWaypointsMarker = {
  push: () => { }
};

const mockWaypoints = [{ waypoint: '' }];

describe('SnDirectionDirective', () => {
  let directive: SnDirectionDirective;
  const api = {
    getNativeMap: () => of({}).toPromise()
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        SnDirectionDirective,
        TestSnDirectionComponent
      ],
      providers: [
        GoogleMapsAPIWrapper,
        MapsAPILoader
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    directive = new SnDirectionDirective(api as unknown as GoogleMapsAPIWrapper);
  });

  beforeEach(() => {
    window['google'] = {
      maps: {
        event: {
          clearListeners: () => { }
        },
        InfoWindow: () => { },
        DirectionsRenderer: MockGoogleMapsClass,
        DirectionsService: MockGoogleMapsClass,
        Marker: MockGoogleMapsClass
      }
    };
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call directionDraw on init when visible is true', () => {
      const spy = spyOn<any>(directive, 'directionDraw');
      directive.visible = true;
      directive.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('shouldn`t call directionDraw on init when visible is false', () => {
      directive.visible = false;
      directive.ngOnInit();
      expect().nothing();
    });
  });

  describe('ngOnChanges', () => {
    it('should call remove Markers and Directions if is visible is false', () => {
      const spies = [
        spyOn<any>(directive, 'removeMarkers'),
        spyOn<any>(directive, 'removeDirections')
      ];
      directive.visible = false;
      directive.ngOnChanges({});
      spies.forEach(spy => expect(spy).toHaveBeenCalled());
    });

    it('should call directionDraw on changes if visible is true, in the first change and the direction display is undefined', () => {
      const spy = spyOn<any>(directive, 'directionDraw');
      directive.visible = true;
      (directive as any).isFirstChange = true;
      (directive as any).directionsDisplay = undefined;
      directive.ngOnChanges({});
      expect(spy).toHaveBeenCalled();
      expect((directive as any).isFirstChange).toBeFalsy();
    });

    it('shouldn`t call directionDraw on changes if visible is true, in the first change and the direction display is defined', () => {
      directive.visible = true;
      (directive as any).isFirstChange = true;
      (directive as any).directionsDisplay = true;
      directive.ngOnChanges({});
      expect((directive as any).isFirstChange).toBeFalsy();
    });

    it('should call directionDraw, removeMarkers and removeDirections on changes if visible and is not the first change', () => {
      const spies = [
        spyOn<any>(directive, 'directionDraw'),
        spyOn<any>(directive, 'removeMarkers'),
        spyOn<any>(directive, 'removeDirections')
      ];
      const obj = {
        renderOptions: {
          firstChange: false
        }
      };
      directive.visible = true;
      (directive as any).isFirstChange = false;
      directive.ngOnChanges(obj);
      spies.forEach(spy => expect(spy).toHaveBeenCalled());
    });

    it('should call directionDraw, removeMarkers and removeDirections on changes if visible and is not the first change', () => {
      const spy = spyOn<any>(directive, 'directionDraw');
      const obj = {
        renderOptions: {
          firstChange: true
        }
      };
      directive.visible = true;
      (directive as any).isFirstChange = false;
      directive.ngOnChanges(obj);
      expect(spy).toHaveBeenCalled();
    });

    it('should only call directionDraw on changes if visible and object renderOptions is not defined', () => {
      const spy = spyOn<any>(directive, 'directionDraw');
      const obj = {
        renderOptions: undefined
      };
      directive.visible = true;
      (directive as any).isFirstChange = false;
      directive.ngOnChanges(obj);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should destroy Markers and remove Directions when on destroy directive', () => {
      const spies = [
        spyOn<any>(directive, 'removeMarkers'),
        spyOn<any>(directive, 'removeDirections')
      ];
      directive.ngOnDestroy();
      spies.forEach(spy => expect(spy).toHaveBeenCalled());
    });
  });

  describe('removeDirections()', () => {
    it('should clear directionsDisplay if contains data', () => {
      directive.directionsDisplay = mockDirectionsDisplay;
      (directive as any).removeDirections();
      expect(directive.directionsDisplay).toBe(undefined);
    });

    it('shouldn`t clear directionsDisplay if not contains data', () => {
      directive.directionsDisplay = undefined;
      (directive as any).removeDirections();
      expect().nothing();
    });
  });

  describe('removeMarkers()', () => {
    it('should clear markers in origin, destination and waypointsMarker setMap with null', () => {
      const waypointsMarker = [
        { setMap: () => { } }
      ];

      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      (directive as any).removeMarkers();
      expect().nothing();
    });

    it('shouldn`t clear markers in origin, destination and waypointsMarker setMap with null', () => {
      const destinationMarker = undefined;
      const waypointsMarker = [undefined];
      (directive as any).originMarker = undefined;
      (directive as any).destinationMarker = destinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      (directive as any).removeMarkers();
      expect().nothing();
    });
  });

  describe('destroyMarkers()', () => {
    it('should clear listeners of origin marker if origin marker is defined', () => {
      const markerOptions = {
        origin: {
          draggable: true,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      const waypointsMarker = [
        { w: {} }
      ];
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      directive.markerOptions = markerOptions;
      (directive as any).destroyMarkers();
      expect().nothing();
    });

    it('shouldn`t clear listener in dragend if draggable origin is false', () => {
      const markerOptions = {
        origin: {
          draggable: false,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      directive.markerOptions = markerOptions;
      (directive as any).destroyMarkers();
      expect().nothing();
    });

    it('should clear listeners of destination marker if destination marker is defined', () => {
      const markerOptions = {
        origin: {
          draggable: true,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      (directive as any).destinationMarker = mockDestinationMarker;
      directive.markerOptions = markerOptions;
      (directive as any).destroyMarkers();
      expect().nothing();
    });

    it('shouldn`t clear listeners on click from waypoint Markers if there is not markers in defined', () => {
      const markerOptions = {
        origin: {
          draggable: true,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      const waypointsMarker = [
        undefined
      ];
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      directive.markerOptions = markerOptions;
      (directive as any).destroyMarkers();
      expect().nothing();
    });
  });

  describe('directionDraw()', () => {
    it('should ', fakeAsync(() => {
      directive.directionsDisplay = undefined;
      (directive as any).directionDraw();
      tick(50);
      expect(directive.directionsDisplay).toBeTruthy();
    }));

    it('should set directions service with google maps directions service', fakeAsync(() => {
      directive.directionsDisplay = mockDirectionsDisplay;
      (directive as any).directionDraw();
      tick(50);
      expect(directive.directionsDisplay).toBeTruthy();
    }));

    it('should set directions service with a predefined route', fakeAsync(() => {
      const directionsService = {
        route: () => { }
      };
      directive.directionsService = directionsService;
      (directive as any).directionDraw();
      tick(50);
      expect(directive.directionsService).toBeTruthy();
    }));

    it('should set directions display if a panel input is entered', fakeAsync(() => {
      directive.panel = {};
      directive.directionsDisplay = mockDirectionsDisplay;
      (directive as any).directionDraw();
      tick(50);
      expect(directive.directionsDisplay).toBeTruthy();
    }));

    it('should set directions display to set a direction when a render route is entered', fakeAsync(() => {
      directive.renderRoute = {};
      directive.directionsDisplay = mockDirectionsDisplay;
      (directive as any).directionDraw();
      tick(50);
      expect(directive.directionsDisplay).toBeTruthy();
      expect(directive.renderRoute).toBeNull();
    }));

    it('should call directions service route when drawing a path', fakeAsync(() => {
      directive.directionsService = {
        route: () => { }
      };
      (directive as any).directionDraw();
      const spy = spyOn(directive.directionsService, 'route').and.callFake((obj, fn) => { fn(); });
      tick(50);
      expect(spy).toHaveBeenCalled();
    }));

    it('should define elements in route directions service function when config is properly set', fakeAsync(() => {
      const directionsService = {
        route: () => { }
      };
      const markerOptions = {
        origin: {
          map: {},
          position: {},
          draggable: true,
          destination: {}
        },
        destination: {
          map: {},
          position: {},
          draggable: true,
        },
        waypoints: {
          map: {},
          position: {}
        }
      };

      (directive as any).markerOptions = markerOptions;
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = mockWaypointsMarker;
      (directive as any).waypoints = mockWaypoints;
      directive.directionsService = directionsService;
      directive.directionsDisplay = mockDirectionsDisplay;

      spyOn(directive.directionsService, 'route').and.callFake((obj, fn) => {
        fn(mockResponse, 'OK');
      });
      const spies = [
        spyOn<any>(directive, 'destroyMarkers')
      ];
      (directive as any).directionDraw();
      tick(50);
      spies.forEach(spy => expect(spy).toHaveBeenCalled());
    }));

    it('should do nothing in direction service route if marker oprtions is not defined', fakeAsync(() => {
      const directionsService = {
        route: () => { }
      };
      const markerOptions = undefined;

      (directive as any).markerOptions = markerOptions;
      directive.directionsService = directionsService;
      directive.directionsDisplay = mockDirectionsDisplay;

      spyOn(directive.directionsService, 'route').and.callFake((obj, fn) => {
        fn({}, 'OK');
      });

      (directive as any).directionDraw();
      tick(50);
      expect().nothing();
    }));

    it('shouldn`t add listener `dragend` if origin and destination are not draggable', fakeAsync(() => {
      const directionsService = {
        route: () => { }
      };
      const markerOptions = {
        origin: {
          map: {},
          position: {},
          draggable: false
        },
        destination: {
          map: {},
          position: {},
          draggable: false,
        },
        waypoints: [{map: {}}]
      };

      (directive as any).markerOptions = markerOptions;
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = [];
      (directive as any).waypoints = undefined;
      directive.directionsService = directionsService;
      directive.directionsDisplay = mockDirectionsDisplay;

      spyOn(directive.directionsService, 'route').and.callFake((obj, fn) => {
        fn(mockResponse, 'OK');
      });
      (directive as any).directionDraw();
      tick(50);
      expect().nothing();
    }));

    it('shouldn`t config marker options origin and destination if they are undefined', fakeAsync(() => {
      const directionsService = {
        route: () => { }
      };
      const markerOptions = {
        origin: {draggable: false},
        destination: undefined,
        waypoints: [],
        map: undefined
      };

      (directive as any).markerOptions = markerOptions;
      (directive as any).originMarker = mockOriginMarker;
      (directive as any).destinationMarker = mockDestinationMarker;
      (directive as any).waypointsMarker = [];
      (directive as any).waypoints = mockWaypoints;
      directive.directionsService = directionsService;
      directive.directionsDisplay = mockDirectionsDisplay;

      spyOn(directive.directionsService, 'route').and.callFake((obj, fn) => {
        fn(mockResponse, 'OK');
      });
      (directive as any).directionDraw();
      tick(50);
      expect().nothing();
    }));
  });

});
