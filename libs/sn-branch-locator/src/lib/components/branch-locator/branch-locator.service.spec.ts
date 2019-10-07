import { TestBed, async, inject } from '@angular/core/testing';

import { BranchLocatorService } from './branch-locator.service';


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

describe('BranchLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchLocatorService = TestBed.get(BranchLocatorService);
    expect(service).toBeTruthy();
  });

  it('When watchPosition is called Then return an observable Position', async(
    inject([BranchLocatorService], (nameService) => {

      spyOn(navigator.geolocation, 'watchPosition').and.returnValue(position);

      nameService.watchPosition().subscribe((pos: Position) => {
        expect(pos).toBe(position);
      });
    }))
  );

  it('When getCurrentPosition is called Then return an observable Position', async(
    inject([BranchLocatorService], (nameService) => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(position);

      nameService.getCurrentPosition().subscribe((pos: Position) => {
        expect(pos).toBe(position);
      });
    }))
  );
});
