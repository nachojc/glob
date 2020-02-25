import { Directive, Input, Output, OnChanges, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { InfoWindow, GoogleMap, Marker } from '@agm/core/services/google-maps-types';

declare var google: any;
@Directive({
  selector: '[snDirection], sn-direction'
})
export class SnDirectionDirective implements OnChanges, OnInit, OnDestroy {

  @Input() origin: any;
  @Input() destination: any;
  @Input() travelMode = 'DRIVING'; // DRIVING (default), BICYCLING, TRANSIT, WALKING
  @Input() transitOptions: any = undefined;
  @Input() drivingOptions: any = undefined;
  @Input() waypoints: any = [];
  @Input() optimizeWaypoints = true;
  @Input() provideRouteAlternatives = false;
  @Input() avoidHighways = false;
  @Input() avoidTolls = false;
  @Input() renderOptions: any;
  @Input() panel: object | undefined;
  @Input() markerOptions: { origin: any, destination: any, waypoints: any };
  @Input() infoWindow: InfoWindow;
  @Input() visible = true;
  @Input() renderRoute: any;

  @Output() _onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() _onResponse: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendInfoWindow: EventEmitter<InfoWindow> = new EventEmitter<InfoWindow>();
  @Output() status: EventEmitter<string> = new EventEmitter<string>();
  @Output() originDrag: EventEmitter<any> = new EventEmitter<any>();
  @Output() destinationDrag: EventEmitter<any> = new EventEmitter<any>();

  public directionsService: any = undefined;
  public directionsDisplay: any = undefined;

  private originMarker: any;
  private destinationMarker: any;
  private waypointsMarker: any = [];

  private isFirstChange = true;

  constructor(
    private gmapsApi: GoogleMapsAPIWrapper,
  ) { }

  ngOnInit() {
    if (this.visible === true) {
      this.directionDraw();
    }
  }

  ngOnChanges(obj: any) {
    if (!this.visible) {
      try {
        this.removeMarkers();
        this.removeDirections();
      } catch (e) { }
    } else {
      if (this.isFirstChange) {
        if (typeof this.directionsDisplay === 'undefined') {
          this.directionDraw();
        }
        this.isFirstChange = false;
        return;
      }

      if (typeof obj.renderOptions !== 'undefined') {
        if (obj.renderOptions.firstChange === false) {
          this.removeMarkers();
          this.removeDirections();
        }
      }
      this.directionDraw();
    }
  }

  ngOnDestroy() {
    this.destroyMarkers();
    this.removeDirections();
  }

  private directionDraw() {
    this.gmapsApi.getNativeMap().then((map: GoogleMap) => {

      if (typeof this.directionsDisplay === 'undefined') {
        this.directionsDisplay = new google.maps.DirectionsRenderer(this.renderOptions);
        this.directionsDisplay.setMap(map);
        this.directionsDisplay.addListener('directions_changed', () => {
          this._onChange.emit(this.directionsDisplay.getDirections());
        });
      }

      if (typeof this.directionsService === 'undefined') {
        this.directionsService = new google.maps.DirectionsService();
      }

      if (typeof this.panel === 'undefined') {
        this.directionsDisplay.setPanel(null);
      } else {
        this.directionsDisplay.setPanel(this.panel);
      }

      if (typeof this.renderRoute === 'object' && this.renderRoute !== null) {
        this.directionsDisplay.setDirections(this.renderRoute);
        this.renderRoute = null;
      } else {

        this.directionsService.route({
          origin: this.origin,
          destination: this.destination,
          travelMode: this.travelMode,
          transitOptions: this.transitOptions,
          drivingOptions: this.drivingOptions,
          waypoints: this.waypoints,
          optimizeWaypoints: this.optimizeWaypoints,
          provideRouteAlternatives: this.provideRouteAlternatives,
          avoidHighways: this.avoidHighways,
          avoidTolls: this.avoidTolls,
        }, (response: any, status: any) => {

          this._onResponse.emit(response);

          this.status.emit(status);

          switch (status) {
            case 'OK':
              this.directionsDisplay.setDirections(response);

              if (typeof this.markerOptions !== 'undefined') {

                this.destroyMarkers();

                const _route = response.routes[0].legs[0];
                try {
                  if (typeof this.markerOptions.origin !== 'undefined') {
                    this.markerOptions.origin.map = map;
                    this.markerOptions.origin.position = _route.start_location;
                    this.originMarker = this.setMarker(
                      map,
                      this.originMarker,
                      this.markerOptions.origin,
                      _route.start_address,
                    );

                    if (this.markerOptions.origin.draggable) {
                      this.originMarker.addListener('dragend', () => {
                        this.origin = this.originMarker.position;
                        this.directionDraw();
                        this.originDrag.emit(this.origin);
                      });
                    }
                  }

                  if (typeof this.markerOptions.destination !== 'undefined') {
                    this.markerOptions.destination.map = map;
                    this.markerOptions.destination.position = _route.end_location;
                    this.destinationMarker = this.setMarker(
                      map,
                      this.destinationMarker,
                      this.markerOptions.destination,
                      _route.end_address,
                    );
                    if (this.markerOptions.destination.draggable) {
                      this.destinationMarker.addListener('dragend', () => {
                        this.destination = this.destinationMarker.position;
                        this.directionDraw();
                        this.destinationDrag.emit(this.destination);
                      });
                    }
                  }

                  if (typeof this.markerOptions.waypoints !== 'undefined') {

                    this.waypoints.forEach((waypoint: any, index: number) => {

                      if (!Array.isArray(this.markerOptions.waypoints)) {
                        this.markerOptions.waypoints.map = map;
                        this.markerOptions.waypoints.position = _route.via_waypoints[index];
                        this.waypointsMarker.push(this.setMarker(
                          map,
                          waypoint,
                          this.markerOptions.waypoints,
                          _route.via_waypoints[index],
                        ));
                      } else {
                        this.markerOptions.waypoints[index].map = map;
                        this.markerOptions.waypoints[index].position = _route.via_waypoints[index];
                        this.waypointsMarker.push(this.setMarker(
                          map,
                          waypoint,
                          this.markerOptions.waypoints[index],
                          _route.via_waypoints[index],
                        ));
                      }

                    });

                  }
                } catch (err) {
                  console.error('MarkerOptions error.', err);
                }
              }

              break;

            default:
              break;
          }
        });
      }
    });
  }

  private setMarker(map: GoogleMap, marker: any, markerOpts: any, content: string): Marker {
    if (typeof this.infoWindow === 'undefined') {
      this.infoWindow = new google.maps.InfoWindow({});
      this.sendInfoWindow.emit(this.infoWindow);
    }
    marker = new google.maps.Marker(markerOpts);
    if (marker.clickable) {
      marker.addListener('click', () => {
        const infowindoContent: string = typeof markerOpts.infoWindow === 'undefined' ? content : markerOpts.infoWindow;
        this.infoWindow.setContent(infowindoContent);
        this.infoWindow.open(map, marker);
      });
    }
    return marker;
  }

  private removeMarkers(): void {
    if (typeof this.originMarker !== 'undefined') {
      this.originMarker.setMap(null);
    }
    if (typeof this.destinationMarker !== 'undefined') {
      this.destinationMarker.setMap(null);
    }
    this.waypointsMarker.forEach((w: any) => {
      if (typeof w !== 'undefined') {
        w.setMap(null);
      }
    });
  }

  private removeDirections(): void {
    if (this.directionsDisplay !== undefined) {
      this.directionsDisplay.setPanel(null);
      this.directionsDisplay.setMap(null);
      this.directionsDisplay = undefined;
    }
  }

  private destroyMarkers(): void {
    try {
      if (typeof this.originMarker !== 'undefined') {
        google.maps.event.clearListeners(this.originMarker, 'click');
        if (this.markerOptions.origin.draggable) {
          google.maps.event.clearListeners(this.originMarker, 'dragend');
        }
      }
      if (typeof this.destinationMarker !== 'undefined') {
        google.maps.event.clearListeners(this.destinationMarker, 'click');
        if (this.markerOptions.origin.draggable) {
          google.maps.event.clearListeners(this.destinationMarker, 'dragend');
        }
      }
      this.waypointsMarker.forEach((w: any) => {
        if (typeof w !== 'undefined') {
          google.maps.event.clearListeners(w, 'click');
        }
      });
      this.removeMarkers();

    } catch (err) {
      console.error('Can not reset custom marker.', err);
    }
  }
}
