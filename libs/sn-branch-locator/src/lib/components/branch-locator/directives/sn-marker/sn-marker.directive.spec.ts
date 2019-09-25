import { SnMarkerDirective } from './sn-marker.directive';
import { MarkerManager } from '@agm/core';

describe('SnMarkerDirective', () => {
  it('should create an instance', () => {
    const markerManager = {} as MarkerManager;
    const directive = new SnMarkerDirective(markerManager);
    expect(directive).toBeTruthy();
  });
});
