import { Directive } from '@angular/core';
import { AgmMap, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';

@Directive({
  selector: '[snMap],agm-map'
})
export class SnMapDirective {
  constructor(public component: AgmMap, public api: GoogleMapsAPIWrapper) {

  }
}
