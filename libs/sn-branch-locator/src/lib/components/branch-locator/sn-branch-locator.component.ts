import { Component, ViewChild, ViewChildren, QueryList, OnInit, EventEmitter, Output } from '@angular/core';
import { SnMapDirective } from '../../directives/sn-map/sn-map.directive';
import { LatLngLiteral, LatLngBounds, AgmMarker } from '@agm/core';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';

// import { SnMarkerDirective } from '../../directives/sn-marker/sn-marker.directive';
import { from } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { Branch } from '../../models/branch.model';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { FilterComponent } from '../filter/filter.component';
import { DrawerState } from 'sn-common-lib';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { Platform } from '../../services/platform/platform.service';
import { OutputMarkerSelected } from '../../models/output-marker-selected';
import { OutputMapBounds } from '../../models/output-map-bounds';
import { MenuComponent } from '../menu/menu.component';



@Component({
  selector: 'sn-branch-locator',
  templateUrl: 'sn-branch-locator.component.html',
  styleUrls: ['sn-branch-locator.component.scss']
})
export class SnBranchLocatorComponent implements OnInit {

  @Output() markerSelected: EventEmitter<OutputMarkerSelected> = new EventEmitter<OutputMarkerSelected>();
  @Output() mapBounds: EventEmitter<OutputMapBounds> = new EventEmitter<OutputMapBounds>();

  private selectedMarker: AgmMarker;

  @ViewChild(SnMapDirective) map: SnMapDirective;
  @ViewChildren(AgmMarker) branchMarkerList: QueryList<AgmMarker>;
  @ViewChild(FilterComponent) filterView: FilterComponent;
  @ViewChild(MenuComponent) menuComponent: MenuComponent;

  isLoading: boolean = true;
  lat: number;
  lng: number;
  branchIcon = {
    url: 'assets/branchlocator/touchpointIcon.svg',
    scaledSize: { height: 40, width: 40 }
  };
  branchSelectedIcon = {
    url: 'assets/branchlocator/santanderTouchpointSelected.svg',
    scaledSize: { height: 56, width: 56 }
  };
  usericon = {
    url: 'assets/branchlocator/pinVoce.svg',
    scaledSize: { height: 90, width: 90 }
  };
  branchesList: Branch[];


  clusterStyles: ClusterStyle[] =  [
    {
        textColor: '#000000',
        url: 'assets/branchlocator/coffeeBlank.svg',
        height: 40,
        width: 32,
        backgroundPosition: '-4px 2px'
    }
  ];

  userPosition: LatLngLiteral;
  zoom = 13;
  showReCenter: boolean;

  selectedBranch: Branch;
  selectedTabIndex: number;
  filterCounts: number;
  drawerState: DrawerState;
  showDrawer: boolean;
  showNearest: boolean = false;
  isMobile: boolean;
  openNearest: boolean;

  constructor(
    private geoPosition: GeoPositionService,
    private branchService: SnBranchLocatorService,
    private platform: Platform
  ) {
    this.geoPosition.watchPosition()
      .pipe(first()).subscribe(
        (pos: Position) => {
          this.userPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        }
      );
  }

  ngOnInit(): void {
    this.isMobile = this.platform.isMobile;

    this.branchService.branchesObservable.subscribe(res => {
      this.clearSelectedMarker();
      this.branchesList = res;
      this.isLoading = false;
      if (this.openNearest) {
        setTimeout(() => {
          this.selectBranch(this.branchesList[0]);
          this.showNearest = true;
        });
      }
    }, err => {
      console.error(err);
      this.isLoading = false;
    });
  }

  getBranchesByCoordinates(coords: LatLngLiteral = this.userPosition, openNearest: boolean = false) {
    this.isLoading = true;
    this.openNearest = openNearest;
    this.branchService.getBranchesByCoords(coords ? coords : this.userPosition);
  }

  tabsChanged(event: any) {
    this.selectedTabIndex = event.tabIndex;
    if (this.selectedTabIndex === 1) {
      this.clearSelectedMarker();
    }
  }

  selectBranch = (branch: Branch) => {
    const markerFound = this.branchMarkerList['_results'].find(marker => marker.label && marker.label.text === branch.id);
    this.markerSelect(markerFound, branch);
    this.selectedTabIndex = 0;
  }

  markerSelect(selected: AgmMarker, branch: Branch) {
    this.clearSelectedMarker();
    selected.iconUrl = this.branchSelectedIcon as any;
    selected['_markerManager'].updateIcon(selected);
    this.selectedMarker = selected;
    this.selectedBranch = branch;
    this.markerSelected.emit({userPosition: this.userPosition, marker: this.selectedBranch});

    this.openMenu();
    this.openDrawer();
  }

  openMenu() {
    if (this.menuComponent && this.menuComponent.currentState === 'menuClosed') {
      this.menuComponent.open();
    }
  }

  mapClick(event: MouseEvent): void {
    if (this.selectedMarker) {
      this.clearSelectedMarker();
    }
  }
  mapReady(): void {
    this.geoPosition.getCurrentPosition()
      .subscribe((pos: Position) => {
        this.userPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        // this.getBranchesByCoordinates();
        this.goToUserPositon();
      });
  }

  centerChange(mapCenter: LatLngLiteral): void {
    if (this.userPosition && this.userPosition.lng && this.userPosition.lat) {
      this.showReCenter = (
        this.roundCordinates(this.userPosition.lng) !== this.roundCordinates(mapCenter.lng)
        || this.roundCordinates(this.userPosition.lat) !== this.roundCordinates(mapCenter.lat));
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

  drawerStageChange(state: DrawerState): void {
    if (state === DrawerState.Bottom) {
      this.clearSelectedMarker();
    } else {
      this.openDrawer();
    }
  }

  closeInfo() {
    this.showDrawer = !this.showDrawer;
  }

  placeChange(place: LatLngLiteral) {
    this.clearSelectedMarker();
    from(this.map.api.panTo(place)).pipe(
      switchMap(() => from(this.map.api.setZoom(this.zoom)))
    ).subscribe(res => {
      this.getBranchesByBounds();
    });
  }

  onFilterApply(event) {
    this.filterCounts = event.count;
    this.getBranchesByBounds();
  }

  showFilter() {
    this.clearSelectedMarker();
    this.filterView.open();
  }

  private roundCordinates(cord: number) {
    return Math.round(cord * 1e7) / 1e7;
  }

  private clearSelectedMarker(): void {
    this.showNearest = false;
    this.closeDrawer();
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
    from(this.map.api.getBounds()).
      subscribe((mapBounds: LatLngBounds) => {
        const northEast = { lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng() };
        const southWest = { lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng() };
        this.mapBounds.emit({northEast, southWest});
        this.isLoading = true;
        this.openNearest = false;
        this.branchService.getBranchesByBounds(northEast, southWest);
      });
  }
}
