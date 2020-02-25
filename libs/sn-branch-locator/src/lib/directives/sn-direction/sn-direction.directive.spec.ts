import { SnDirectionDirective } from './sn-direction.directive';
import { GoogleMapsAPIWrapper } from '@agm/core';

describe('SnDirectionDirective', () => {
  it('should create an instance', () => {
    const api = {} as GoogleMapsAPIWrapper;
    const directive = new SnDirectionDirective(api);
    expect(directive).toBeTruthy();
  });
});
