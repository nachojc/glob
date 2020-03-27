import { Directive, Input, Output, OnChanges, EventEmitter, OnDestroy } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { InfoWindow, GoogleMap, Marker } from '@agm/core/services/google-maps-types';

declare var google: any;

@Directive({
  selector: '[snDirection], sn-direction'
})
export class SnDirectionDirective implements OnChanges, OnDestroy {

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
  @Output() _onLoad: EventEmitter<any> = new EventEmitter<any>();
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

  private map: GoogleMap;
  private directions: any = {};
  private durations: any = {};
  private travelModes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];

  constructor(
    private gmapsApi: GoogleMapsAPIWrapper,
  ) { }

  ngOnChanges(obj: any) {
    console.log(obj);
    if (!this.visible) {
      try {
        this.removeMarkers();
        this.removeDirections();
      } catch (e) { }
    } else {

      if (!obj.destination.previousValue || obj.destination.previousValue.lng !== obj.destination.currentValue.lng
        || obj.destination.previousValue.lat !== obj.destination.currentValue.lat) {
        this.directions = {};
        this.getDirections();
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

  private getDirections() {
    this.gmapsApi.getNativeMap().then((map: GoogleMap) => {
      this.map = map;

      if (typeof this.directionsDisplay === 'undefined') {
        this.directionsDisplay = new google.maps.DirectionsRenderer(this.renderOptions);
        this.directionsDisplay.setMap(this.map);
        this.directionsDisplay.addListener('directions_changed', () => {
          this._onChange.emit(this.directionsDisplay.getDirections());
        });
      }

      if (typeof this.directionsService === 'undefined') {
        this.directionsService = new google.maps.DirectionsService();
      }

      this.directionsDisplay.setPanel(
        (typeof this.panel === 'undefined') ? null : this.panel
      );

      if (typeof this.renderRoute === 'object' && this.renderRoute !== null) {
        this.directionsDisplay.setDirections(this.renderRoute);
        this.renderRoute = null;
      } else {
        let len = this.travelModes.length;

        while (len--) {
          this.directionsService.route({
            origin: this.origin,
            destination: this.destination,
            travelMode: this.travelModes[len],
            transitOptions: this.transitOptions,
            drivingOptions: this.drivingOptions,
            waypoints: this.waypoints,
            optimizeWaypoints: this.optimizeWaypoints,
            provideRouteAlternatives: this.provideRouteAlternatives,
            avoidHighways: this.avoidHighways,
            avoidTolls: this.avoidTolls,
          }, (response: any, status: any) => {
            if (status === 'OK') {
              this.status.emit(status);
              this.durations[response.request.travelMode] = response.routes[0].legs[0].duration.text;
              this.directions[response.request.travelMode] = response;
              if (Object.keys(this.directions).length === this.travelModes.length) {
                this._onLoad.emit(this.durations);
                this.directionDraw();
              }
            }
          });
        }
      }
    });
  }

  private directionDraw() {
    const response = this.directions[this.travelMode];
    this._onResponse.emit(response);
    this.directionsDisplay.setDirections(response);

    if (typeof this.markerOptions !== 'undefined') {
      this.destroyMarkers();
      const _route = response.routes[0].legs[0];
      try {
        if (typeof this.markerOptions.origin !== 'undefined') {
          this.markerOptions.origin.map = this.map;
          this.markerOptions.origin.position = _route.start_location;
          this.originMarker = this.setMarker(
            this.map,
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
          this.markerOptions.destination.map = this.map;
          this.markerOptions.destination.position = _route.end_location;
          this.destinationMarker = this.setMarker(
            this.map,
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
              this.markerOptions.waypoints.map = this.map;
              this.markerOptions.waypoints.position = _route.via_waypoints[index];
              this.waypointsMarker.push(this.setMarker(
                this.map,
                waypoint,
                this.markerOptions.waypoints,
                _route.via_waypoints[index],
              ));
            } else {
              this.markerOptions.waypoints[index].map = this.map;
              this.markerOptions.waypoints[index].position = _route.via_waypoints[index];
              this.waypointsMarker.push(this.setMarker(
                this.map,
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
    this.waypointsMarker.forEach((waypoint: any) => {
      if (typeof waypoint !== 'undefined') {
        waypoint.setMap(null);
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
