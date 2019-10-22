import { Directive } from '@angular/core';
import { AgmMarker, MarkerManager } from '@agm/core';

@Directive({
  selector: '[snMarker]'
})
export class SnMarkerDirective extends AgmMarker {

  constructor(public markerManager: MarkerManager) {
    super(markerManager);
  }

}
