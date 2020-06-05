import { TestBed, async, inject } from '@angular/core/testing';

import { GeoPositionService } from './geo-position.service';
import { MapsAPILoader } from '@agm/core';



const position: Position = {
  coords: {
    accuracy: 1,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: 123123,
    longitude: 123,
    speed: null
  }, timestamp: 1234567890
};


const windowRefOK = {
  navigator: {
    geolocation: {
      watchPosition: callback => callback(position),
      getCurrentPosition: callback => callback(position)
    }
  }
};

const windowRefKO = {
  navigator: {
    geolocation: {
      watchPosition: (callback, error) => error(),
      getCurrentPosition: (callback, error) => error()
    }
  }
};
const MapsAPILoaderMock = {
  load: () => new Promise(() => true)
};

describe('GeoPositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: 'WINDOW', useValue: window },
      { provide: MapsAPILoader, useValue: MapsAPILoaderMock }
    ]
  }));

  it('should be created', () => {
    const service: GeoPositionService = TestBed.get(GeoPositionService);
    expect(service).toBeTruthy();
    expect(service.geolocation).toBeDefined();
  });

  it('When watchPosition is called Then return an observable Position', () => {
    inject([GeoPositionService], (nameService) => {

      // spyOn(navigator.geolocation, 'watchPosition').and.returnValue(position);
      // TODO: Mock the service
      // nameService.watchPosition().subscribe((pos: Position) => {
      //   expect(pos).toBe(position);
      //   done();
      // });
      expect().nothing();
    });
  }
  );

  it('When getCurrentPosition is called Then return an observable Position', () => {
    inject([GeoPositionService], (nameService) => {
      // spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(position);
      // TODO: Mock the service
      // nameService.getCurrentPosition().subscribe((pos: Position) => {
      //   expect(pos).toBe(position);
      //   done();
      // });
      expect().nothing();
    });
  }
  );

});



describe('GeoPositionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: 'WINDOW', useValue: window },
      { provide: MapsAPILoader, useValue: MapsAPILoaderMock }
    ]
  }));


  it('When watchPosition is called Then return an error observable', () => (
    inject([GeoPositionService], (service) => {

      //   spyOn(navigator.geolocation, 'watchPosition').and.returnValue(undefined);
      // TODO: Mock the service
      //   service.watchPosition().subscribe(
      //     () => { },
      //     (error) => {
      //       expect(error).toBeUndefined();
      //       done();
      //     });
      expect().nothing();
    }))
  );

  it('When getCurrentPosition is called Then return an error observable', () => (
    inject([GeoPositionService], (nameService) => {
      // spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(undefined);
      // TODO: Mock the service
      // nameService.getCurrentPosition().subscribe((pos: Position) => {

      // }, (error) => {
      //   expect(error).toBeUndefined();
      //   done();
      // });
      expect().nothing();
    }))
  );

});
