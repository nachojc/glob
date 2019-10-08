import { SnMapDirective } from './sn-map.directive';
import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';

describe('SnMapDirective', () => {
  it('should create an instance', () => {
    const component = {} as AgmMap;
    const api = {} as GoogleMapsAPIWrapper;
    const directive = new SnMapDirective(component, api);
    expect(directive).toBeTruthy();
  });
});
