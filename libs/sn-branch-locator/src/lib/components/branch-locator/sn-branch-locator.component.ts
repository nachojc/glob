import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { SnMapDirective } from '../../directives/sn-map/sn-map.directive';
import { LatLngLiteral, LatLngBounds } from '@agm/core';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';

import { SnMarkerDirective } from '../../directives/sn-marker/sn-marker.directive';
import { from } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { Branch } from '../../models/branch.model';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { FilterComponent } from '../filter/filter.component';
import { DrawerState } from 'sn-common-lib';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { Platform } from '../../services/platform/platform.service';



@Component({
  selector: 'sn-branch-locator',
  templateUrl: 'sn-branch-locator.component.html',
  styleUrls: ['sn-branch-locator.component.scss']
})
export class SnBranchLocatorComponent implements OnInit {


  private selectedMarker: SnMarkerDirective;

  @ViewChild(SnMapDirective) map: SnMapDirective;
  @ViewChildren(SnMarkerDirective) branchMarkerList: QueryList<SnMarkerDirective>;
  @ViewChild(FilterComponent) filterView: FilterComponent;

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

  constructor(
    private service: GeoPositionService,
    private branchService: SnBranchLocatorService,
    private platform: Platform
  ) {
    this.service.watchPosition()
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
  }

  getBranchesByCoordinates(coords: LatLngLiteral = this.userPosition, openNearest: boolean = false) {
    this.isLoading = true;
    this.branchService.getBranchesByCoords(coords ? coords : this.userPosition).subscribe(res => {
      this.clearSelectedMarker();
      this.branchesList = res;
      this.isLoading = false;
      if (openNearest) {
        setTimeout(() => {
          this.selectBranch(this.branchesList[0]);
          this.showNearest = true;
        });
      }
    }, err => {
      // TODO: Add error handler
      console.error(err);
      this.isLoading = false;
    });
  }

  tabsChanged(event: any) {
    this.selectedTabIndex = event.tabIndex;
    if (this.selectedTabIndex === 1) {
      this.clearSelectedMarker();
    }
  }

  selectBranch = (branch: Branch) => {
    // tslint:disable-next-line: no-string-literal
    const markerFound = this.branchMarkerList['_results'].find(marker => marker.title === branch.id);
    this.markerSelected(markerFound, branch);
    this.selectedTabIndex = 0;
  }

  markerSelected(selected: SnMarkerDirective, branch: Branch) {
    this.clearSelectedMarker();

    selected.iconUrl = this.branchSelectedIcon as any;
    selected.markerManager.updateIcon(selected);
    this.selectedMarker = selected;
    this.selectedBranch = branch;


    selected.markerManager.getNativeMarker(selected).then((nativeMarker: any) => {
      const selectedPos: LatLngLiteral = {
        lat: nativeMarker.position.lat(),
        lng: nativeMarker.position.lng()
      };
      this.map.api.panTo(selectedPos).then(() => this.map.api.setZoom(this.zoom)).then(() => {
        if (Boolean(this.selectedMarker)) {
          this.openDrawer();
        }
      });
    });
  }

  mapClick(event: MouseEvent): void {
    if (this.selectedMarker) {
      this.clearSelectedMarker();

    }
  }

  mapReady(): void {
    this.service.getCurrentPosition()
      .subscribe((pos: Position) => {
        this.userPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.getBranchesByCoordinates();
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
    this.isLoading = true;
    this.clearSelectedMarker();
    from(this.map.api.panTo(place)).pipe(
      switchMap(() => from(this.map.api.setZoom(this.zoom))),
      switchMap(() => from(this.map.api.getBounds()))
    ).subscribe((mapBounds: LatLngBounds) => {
      this.branchService.getBranchesByBounds(
        { lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng() },
        { lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng() }
      ).subscribe(res => {
        this.clearSelectedMarker();
        this.branchesList = res;
        this.isLoading = false;
      }, (error) => {
        // TODO: Add error handler
        console.error(error);
      });
    });
  }

  onFilterApply(event) {
    this.filterCounts = event.count;
    from(this.map.api.getBounds()).pipe(
      switchMap((mapBounds: LatLngBounds) => {
        this.isLoading = true;
        return this.branchService.getBranchesByBounds({
          lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng()
        },
          { lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng() }
        );
      })
    ).subscribe(res => {
      this.clearSelectedMarker();
      this.branchesList = res;
      this.isLoading = false;
    }, (error) => {
      // TODO: Add error handler
      console.error(error);
      this.isLoading = false;
    });

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
      this.selectedMarker.markerManager.updateIcon(this.selectedMarker);
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

  private goToUserPositon(): void {
    if (this.userPosition) {
      this.map.api.panTo(this.userPosition).then(() => this.map.api.setZoom(this.zoom));
    }
  }
}
