import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  OnInit,
  EventEmitter,
  Output,
  Input} from '@angular/core';
import { SnMapDirective } from '../../directives/sn-map/sn-map.directive';
import { LatLngLiteral, LatLngBounds, AgmMarker } from '@agm/core';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';

import { from, Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
import { Branch } from '../../models/branch.model';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { FilterComponent } from '../filter/filter.component';
import { DrawerState } from 'sn-common-lib';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { Platform } from '../../services/platform/platform.service';
import { OutputMarkerSelected } from '../../models/output-marker-selected';
import { OutputMapBounds } from '../../models/output-map-bounds';
import { OutputDirection } from '../../models/output-direction';
import { MenuComponent } from '../menu/menu.component';
import { IStartingPosition } from '../../models/starting-position.interface';

@Component({
  selector: 'sn-branch-locator',
  templateUrl: 'sn-branch-locator.component.html',
  styleUrls: ['sn-branch-locator.component.scss']
})
export class SnBranchLocatorComponent implements OnInit {
  @Input()
  get coordinates(): any {
    return this._coordinates;
  }
  set coordinates(value: any) {
    this._coordinates = value;
  }
  @Input()
  get defaultLang(): any {
    return this._defaultLang;
  }
  set defaultLang(value: any) {
    this._defaultLang = value;
  }
  @Input()
  get address(): any {
    return this._address;
  }
  set address(value: any) {
    this._address = value;
    this.searchAddress(this._address);
  }

  @Input() startingPosition: IStartingPosition;
  @Input()
  get optionalFullScreenControl(): boolean {
    return this._optionalFullScreen;
  }
  set optionalFullScreenControl(value: boolean) {
    this._optionalFullScreen = value !== null && value !== undefined && `${value}` !== 'false';
  }

  @Input()
  get optionalBranding(): boolean {
    return this._optionalBranding;
  }
  set optionalBranding(value: boolean) {
    this._optionalBranding = value !== null && value !== undefined && `${value}` !== 'false';
  }
  @Output() markerSelected: EventEmitter<OutputMarkerSelected> = new EventEmitter<
    OutputMarkerSelected
  >();
  @Output() mapBounds: EventEmitter<OutputMapBounds> = new EventEmitter<OutputMapBounds>();

  private selectedMarker: AgmMarker;
  public _optionalFullScreen = false;
  private _optionalBranding = false;
  private _coordinates: string;
  private _address: string;
  private _defaultLang: string;

  @ViewChild(SnMapDirective, { static: false }) map: SnMapDirective;
  @ViewChildren(AgmMarker) branchMarkerList: QueryList<AgmMarker>;
  @ViewChild(FilterComponent, { static: false }) filterView: FilterComponent;
  @ViewChild(MenuComponent, { static: false }) menuComponent: MenuComponent;

  public isLoading: boolean = true;
  public lat: number;
  public lng: number;
  public branchIcon = {
    url: 'assets/branchlocator/touchpointIcon.svg',
    scaledSize: { height: 40, width: 40 }
  };
  public branchSelectedIcon = {
    url: 'assets/branchlocator/santanderTouchpointSelected.svg',
    scaledSize: { height: 56, width: 56 }
  };
  public usericon = {
    url: 'assets/branchlocator/pinVoce.svg',
    scaledSize: { height: 90, width: 90 }
  };
  public branchesList: Branch[];

  public clusterStyles: ClusterStyle[] = [
    {
      textColor: '#000000',
      url: 'assets/branchlocator/coffeeBlank.svg',
      height: 40,
      width: 32,
      backgroundPosition: '-4px 2px'
    }
  ];

  public userPosition: LatLngLiteral;
  public zoom = 13;
  public showReCenter: boolean;

  public selectedBranch: Branch;
  public selectedTabIndex: number;
  public filterCounts: number;
  public drawerState: DrawerState;
  public showDrawer: boolean;
  public showDirectionsPanel: boolean;
  public showNearest: boolean = false;
  public isMobile: boolean;
  public openNearest: boolean;

  public isVisibleMarkers = true;
  public isVisibleRoute = false;
  public destination: LatLngLiteral;
  public origin: LatLngLiteral;
  public travelMode: string;
  public routes = [];

  public addressLat: number;
  public addressLng: number;

  constructor(
    private geoPosition: GeoPositionService,
    private branchService: SnBranchLocatorService,
    private platform: Platform
  ) {
    this.geoPosition
      .watchPosition()
      .pipe(first())
      .subscribe((pos: Position) => {
        this.userPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      });
  }

  ngOnInit(): void {
    this.isMobile = this.platform.isMobile;

    this.branchService.onChange.subscribe(
      res => {
        this.closeDrawer();
        this.clearSelectedMarker();
        this.branchesList = res.sort((a, b) =>
          a.distanceInKm > b.distanceInKm ? 1 : b.distanceInKm > a.distanceInKm ? -1 : 0
        );
        this.isLoading = false;
        if (this.openNearest) {
          setTimeout(() => {
            this.selectBranch(this.branchesList[0]);
            this.showNearest = true;
          });
        }
      },
      err => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  searchAddress(address: string): void {
    if (address !== null) {
      this.geoPosition.getPositionByText(address).subscribe(coords => {
        this.zoom = 15;
        this.addressLat = coords.lat;
        this.addressLng = coords.lng;
      });
    }
  }

  getBranchesByCoordinates(
    coords: LatLngLiteral = this.userPosition,
    openNearest: boolean = false
  ) {
    this.isLoading = true;
    this.openNearest = openNearest;
    this.branchService.getBranchesByCoords(coords ? coords : this.userPosition);
  }

  tabsChanged(event: any) {
    this.selectedTabIndex = event.tabIndex;
    if (this.selectedTabIndex === 1) {
      this.closeDrawer();
      this.clearSelectedMarker();
    }
  }

  selectBranch = (branch: Branch) => {
    const markerFound = this.branchMarkerList['_results'].find(
      marker => marker.label && marker.label.text === branch.id
    );
    this.markerSelect(markerFound, branch);
    this.selectedTabIndex = 0;
  }

  markerSelect(selected: AgmMarker, branch: Branch) {
    this.closeDrawer();
    this.clearSelectedMarker();
    selected.iconUrl = this.branchSelectedIcon as any;
    selected['_markerManager'].updateIcon(selected);
    this.selectedMarker = selected;
    this.selectedBranch = branch;
    this.markerSelected.emit({
      userPosition: this.userPosition,
      marker: this.selectedBranch
    });

    this.openMenu();
    this.openDrawer();
  }

  openMenu() {
    if (this.menuComponent && this.menuComponent.currentState === 'menuClosed') {
      this.menuComponent.open();
    }
  }

  mapReady(): void {
    this.geoPosition.getCurrentPosition().subscribe((pos: Position) => {
      this.userPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      if (this.startingPosition && this.startingPosition.text) {
        this.geoPosition
          .getPositionByText(this.startingPosition.text)
          .subscribe(coords => this.placeChange(coords));
      } else if (this.startingPosition && this.startingPosition.coordinates) {
        this.placeChange(this.startingPosition.coordinates);
      } else {
        this.goToUserPositon();
      }
    });
  }

  centerChange(mapCenter: LatLngLiteral): void {
    if (this.userPosition && this.userPosition.lng && this.userPosition.lat) {
      this.showReCenter =
        this.roundCordinates(this.userPosition.lng) !== this.roundCordinates(mapCenter.lng) ||
        this.roundCordinates(this.userPosition.lat) !== this.roundCordinates(mapCenter.lat);
    } else {
      this.showReCenter = false;
    }
  }

  centerMapToUser(callAPI: boolean = true, openNearest: boolean = false) {
    this.goToUserPositon();
    if (callAPI) {
      this.getBranchesByCoordinates(this.userPosition, openNearest);
    } else if (openNearest && this.branchesList && this.branchesList.length > 0) {
      this.selectBranch(this.branchesList[0]);
      this.showNearest = true;
    }
  }

  drawerStageChange(state): void {
    if (state === DrawerState.Bottom) {
      this.closeDrawer();
      this.clearSelectedMarker();
    } else {
      this.openDrawer();
    }
  }

  closeInfo() {
    this.isVisibleRoute = false;
    this.isVisibleMarkers = true;
    this.clearSelectedMarker();
    this.getBranchesByBounds();
    this.showDrawer = !this.showDrawer;
  }

  closeDirectionsPanel(): void {
    this.routes = [];
    this.showDirectionsPanel = false;
    this.openDrawer();
  }

  openDirectionsPanel(): void {
    this.showDirectionsPanel = true;
    this.closeDrawer();
  }

  onDirectionsResponse(event: any): void {
    if (typeof event.routes !== 'undefined' && event.routes.length > 0) {
      const steps = event.routes[0].legs[0].steps;
      this.routes = [];
      for (let i = 0; i < steps.length; i++) {
        const _instruction = steps[i].instructions;
        const _distance = steps[i].distance.text;
        const _time = steps[i].duration.text;
        this.routes.push({
          id: i + 1,
          instructions: _instruction,
          distance: _distance,
          time: _time
        });
      }
    }
  }

  drawDirections(branchDirection: OutputDirection): void {
    this.travelMode = branchDirection.travelMode;

    this.destination = {
      lng: branchDirection.geoCoords.longitude,
      lat: branchDirection.geoCoords.latitude
    };
    this.origin = this.userPosition;

    this.isVisibleRoute = true;
    this.isVisibleMarkers = false;
  }

  placeChange(place: LatLngLiteral) {
    this.closeDrawer();
    this.clearSelectedMarker();
    from(this.map.api.panTo(place))
      .pipe(switchMap(() => from(this.map.api.setZoom(this.zoom))))
      .subscribe(() => {
        this.getBranchesByBounds();
      });
  }

  onFilterApply(event) {
    this.filterCounts = event.count;
    this.getBranchesByBounds();
  }

  showFilter() {
    this.closeDrawer();
    this.clearSelectedMarker();
    this.filterView.open();
  }

  private roundCordinates(cord: number) {
    return Math.round(cord * 1e7) / 1e7;
  }

  private clearSelectedMarker(): void {
    this.showNearest = false;
    if (this.selectedMarker) {
      this.selectedMarker.iconUrl = this.branchIcon as any;
      this.selectedMarker['_markerManager'].updateIcon(this.selectedMarker);
      this.selectedMarker = undefined;
      this.selectedBranch = undefined;
    }
  }

  private closeDrawer(): void {
    this.showDrawer = false;
  }

  private openDrawer(): void {
    this.showDrawer = true;
  }

  public goToUserPositon(): void {
    if (this.userPosition) {
      this.map.api.panTo(this.userPosition).then(() => this.map.api.setZoom(this.zoom));
    }
  }

  tilesLoaded() {
    this.getBranchesByBounds();
  }

  getBranchesByBounds() {
    if (!this.isVisibleRoute) {
      from(this.map.api.getBounds()).subscribe((mapBounds: LatLngBounds) => {
        if (mapBounds) {
          const northEast = {
            lat: mapBounds.getNorthEast().lat(),
            lng: mapBounds.getNorthEast().lng()
          };
          const southWest = {
            lat: mapBounds.getSouthWest().lat(),
            lng: mapBounds.getSouthWest().lng()
          };
          this.mapBounds.emit({ northEast, southWest });
          this.isLoading = true;
          this.openNearest = false;
          this.position.subscribe(pos => {
            this.branchService.getBranchesByBounds(northEast, southWest, pos);
          });
        }
      });
    }
  }
  private get position(): Observable<LatLngLiteral> {
    if (this.userPosition) {
      return of(this.userPosition);
    } else {
      return this.geoPosition.getCurrentPosition().pipe(
        map((pos: Position) => {
          this.userPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          return this.userPosition;
        })
      );
    }
  }
}
