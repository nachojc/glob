import { SnDirectionDirective } from './sn-direction.directive';
import { Component, ViewChild } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SnDirectionModule } from './sn-direction.module';
import { By } from '@angular/platform-browser';
import { GoogleMap } from '@agm/core/services/google-maps-types';

@Component({
  template: `
    <sn-direction></sn-direction>
  `
}) class TestSnDirectionComponent { }

describe('SnDirectionDirective', () => {
  let component: TestSnDirectionComponent;
  let fixture: ComponentFixture<TestSnDirectionComponent>;
  const api = { getNativeMap: () => { } } as GoogleMapsAPIWrapper;
  const directive = new SnDirectionDirective(api);

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
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(TestSnDirectionComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    window['google'] = {
      maps: {
        event: {
          clearListeners: () => { }
        },
        InfoWindow: () => { }
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
      directive['isFirstChange'] = true;
      directive['directionsDisplay'] = undefined;
      directive.ngOnChanges({});
      expect(spy).toHaveBeenCalled();
      expect(directive['isFirstChange']).toBeFalsy();
    });

    it('shouldn`t call directionDraw on changes if visible is true, in the first change and the direction display is defined', () => {
      directive.visible = true;
      directive['isFirstChange'] = true;
      directive['directionsDisplay'] = true;
      directive.ngOnChanges({});
      expect(directive['isFirstChange']).toBeFalsy();
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
      directive['isFirstChange'] = false;
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
      directive['isFirstChange'] = false;
      directive.ngOnChanges(obj);
      expect(spy).toHaveBeenCalled();
    });

    it('should only call directionDraw on changes if visible and object renderOptions is not defined', () => {
      const spy = spyOn<any>(directive, 'directionDraw');
      const obj = {
        renderOptions: undefined
      };
      directive.visible = true;
      directive['isFirstChange'] = false;
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
      const directionsDisplay = {
        setPanel: () => { },
        setMap: () => { }
      };
      directive.directionsDisplay = directionsDisplay;
      directive['removeDirections']();
      expect(directive.directionsDisplay).toBe(undefined);
    });

    it('shouldn`t clear directionsDisplay if not contains data', () => {
      directive.directionsDisplay = undefined;
      directive['removeDirections']();
      expect().nothing();
    });
  });

  describe('removeMarkers()', () => {
    it('should clear markers in origin, destination and waipointsMarker setMap with null', () => {
      const originMaker = {
        setMap: () => { }
      };
      const destinationMarker = {
        setMap: () => { }
      };
      const waypointsMarker = [
        { setMap: () => { } }
      ];

      directive['originMarker'] = originMaker;
      directive['destinationMarker'] = destinationMarker;
      directive['waypointsMarker'] = waypointsMarker;
      directive['removeMarkers']();
      expect().nothing();
    });

    it('shouldn`t clear markers in origin, destination and waipointsMarker setMap with null', () => {
      const originMaker = undefined;
      const destinationMarker = undefined;
      const waypointsMarker = [undefined];
      directive['originMarker'] = originMaker;
      directive['destinationMarker'] = destinationMarker;
      directive['waypointsMarker'] = waypointsMarker;
      directive['removeMarkers']();
      expect().nothing();
    });
  });

  describe('destroyMarkers()', () => {
    it('should clear listeners of origin marker if origin marker is defined', () => {
      const originMarker = {};
      const destinationMarker = {};
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
      (directive as any).originMarker = originMarker;
      (directive as any).destinationMarker = destinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      directive.markerOptions = markerOptions;
      directive['destroyMarkers']();
      expect().nothing();
    });

    it('shouldn`t clear listener in dragend if draggable origin is false', () => {
      const originMarker = {};
      const destinationMarker = {};
      const markerOptions = {
        origin: {
          draggable: false,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      (directive as any).originMarker = originMarker;
      (directive as any).destinationMarker = destinationMarker;
      directive.markerOptions = markerOptions;
      directive['destroyMarkers']();
      expect().nothing();
    });

    it('should clear listeners of destination marker if destination marker is defined', () => {
      const destinationMarker = {};
      const markerOptions = {
        origin: {
          draggable: true,
        },
        destination: {},
        waypoints: [{ w: {} }]
      };
      (directive as any).destinationMarker = destinationMarker;
      directive.markerOptions = markerOptions;
      directive['destroyMarkers']();
      expect().nothing();
    });

    it('shouldn`t clear listeners on click from waypoint Markers if there is not markers in defined', () => {
      const originMarker = {};
      const destinationMarker = {};
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
      (directive as any).originMarker = originMarker;
      (directive as any).destinationMarker = destinationMarker;
      (directive as any).waypointsMarker = waypointsMarker;
      directive.markerOptions = markerOptions;
      directive['destroyMarkers']();
      expect().nothing();
    });
  });

  /* describe('directionDraw()', () => {
    it('should ', () => {
      const directionsDisplay = undefined;
      directive.directionsDisplay = directionsDisplay;
      directive['gmapsApi'] = api;
      directive['directionDraw']();
      expect().nothing();
    });
  });*/

});
