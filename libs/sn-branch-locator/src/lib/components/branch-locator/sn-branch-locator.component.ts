import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { SnMapDirective } from '../../directives/sn-map/sn-map.directive';
import { LatLngLiteral, LatLngBounds } from '@agm/core';
import { GeoPositionService } from '../../services/geo-position/geo-position.service';

import { SnMarkerDirective } from '../../directives/sn-marker/sn-marker.directive';
import { from } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { Branch } from '../../models/branch.model';
import { SnBranchLocatorService } from '../../services/branch-locator/branch-locator.service';
import { FilterComponent } from '../filter/sn-filter.component';
import { DrawerState } from 'sn-common-lib';



@Component({
  selector: 'sn-branch-locator',
  templateUrl: 'sn-branch-locator.component.html',
  styleUrls: ['sn-branch-locator.component.scss']
})
export class SnBranchLocatorComponent {

  @ViewChild(SnMapDirective) map: SnMapDirective;
  @ViewChildren(SnMarkerDirective) branchMarkerList: QueryList<SnMarkerDirective>;
  @ViewChild(FilterComponent) filterView: FilterComponent;
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

  userPosition: LatLngLiteral;
  zoom = 13;
  showDrawer: boolean;
  showReCenter: boolean;

  private selectedMarker: SnMarkerDirective;
  selectedBranch: Branch;
  selectedTabIndex: number;
  filterCounts: number;

  constructor(
    private service: GeoPositionService,
    private branchService: SnBranchLocatorService,
    // private translate: TranslateService
  ) {
  }

  getBranchesByCoordinates(coords: LatLngLiteral) {
    this.branchService.getBranchesByCoords(coords).subscribe(res => {
      this.branchesList = res;
    }, err => {
      // TODO: Add error handler
      console.error(err);
    });
  }

  tabsChanged(event: any) {
    this.selectedTabIndex = event.tabIndex;
  }

  selectBranch = (branch: Branch) => {
    this.selectedTabIndex = 0;
    // tslint:disable-next-line: no-string-literal
    const markerFound = this.branchMarkerList['_results'].find(marker => marker.title === branch.id);
    this.markerSelected(markerFound, branch);
  }


  markerSelected(selected: SnMarkerDirective, branch: Branch) {
    if (this.selectedMarker) {
      this.selectedMarker.iconUrl = this.branchIcon as any;
      this.selectedMarker.markerManager.updateIcon(this.selectedMarker);
    }
    selected.iconUrl = this.branchSelectedIcon as any;
    selected.markerManager.updateIcon(selected);
    this.selectedMarker = selected;
    this.selectedBranch = branch;
    this.showDrawer =  Boolean(this.selectedMarker);
    selected.markerManager.getNativeMarker(selected).then((nativeMarker: any) => {
      const selectedPos: LatLngLiteral = {
        lat: nativeMarker.position.lat(),
        lng:  nativeMarker.position.lng()
      };
      this.map.api.panTo(selectedPos);
    });
  }

  mapClick(event: MouseEvent): void {
    if (this.selectedMarker) {
      this.selectedMarker.iconUrl = this.branchIcon as any;
      this.selectedMarker.markerManager.updateIcon(this.selectedMarker);
      this.selectedMarker = undefined;
      this.showDrawer =  Boolean(this.selectedMarker);
      this.selectedBranch = undefined;
    }
  }

  mapReady(): void {
    this.centerMapToUser();
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

  centerChange(mapCenter: LatLngLiteral): void {
    if (this.userPosition && this.userPosition.lng && this.userPosition.lat) {
      this.showReCenter = (
        this.roundCordinates(this.userPosition.lng) !== this.roundCordinates(mapCenter.lng)
        || this.roundCordinates(this.userPosition.lat) !== this.roundCordinates(mapCenter.lat));
    } else {
      this.showReCenter = false;
    }
  }


  private roundCordinates(cord: number) {
    return Math.round(cord * 1e7) / 1e7;
  }

  centerMapToUser() {
    if (this.userPosition && this.userPosition.lat && this.userPosition.lng) {
      this.map.api.panTo(this.userPosition);
      this.getBranchesByCoordinates({lat: this.userPosition.lat, lng: this.userPosition.lng});
    } else {
      this.service.getCurrentPosition()
        .subscribe((pos: Position) => {
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.map.api.panTo(newCenter);

          this.getBranchesByCoordinates({lat: pos.coords.latitude, lng: pos.coords.longitude});
        });
    }
  }


  drawerStageChange(state: DrawerState): void {
    if (state === DrawerState.Bottom) {
      this.showDrawer = false;
    }
  }


  placeChange(place: LatLngLiteral) {
    from(this.map.api.panTo(place)).pipe(
      switchMap(() => from(this.map.api.setZoom(this.zoom))),
      switchMap(() => from(this.map.api.getBounds())),
      switchMap((mapBounds: LatLngBounds) => {
        return this.branchService.getBranchesByBounds({
          lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng()
        },
          { lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng() }
        );
      })
    ).subscribe(res => {
      this.branchesList = res;
    }, (error) => {
      // TODO: Add error handler
      console.error(error);
    });
  }


  onFilterApply(event) {
    this.filterCounts = event.count;
    from(this.map.api.getBounds()).pipe(
      switchMap((mapBounds: LatLngBounds) => {
        return this.branchService.getBranchesByBounds({
          lat: mapBounds.getNorthEast().lat(), lng: mapBounds.getNorthEast().lng()
        },
          { lat: mapBounds.getSouthWest().lat(), lng: mapBounds.getSouthWest().lng() }
        );
      })
    ).subscribe(res => {
      this.branchesList = res;
    }, (error) => {
      // TODO: Add error handler
      console.error(error);
    });

  }

    showFilter(visible: boolean) {
      this.filterView.open();
    }


}
