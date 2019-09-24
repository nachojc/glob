import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { SnMapDirective } from './components/branch-locator/directives/sn-map/sn-map.directive';
import { AgmMarker, LatLngLiteral } from '@agm/core';
import { BranchLocatorService } from './components/branch-locator/branch-locator.service';
import { DrawerState } from './components/sn-drawer/models/sn-drawer-state.model';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';

@Component({
  selector: 'sn-branch-locator',
  templateUrl: 'sn-branch-locator.component.html',
  styleUrls: ['sn-branch-locator.component.scss']
})
export class SnBranchLocatorComponent {

  @ViewChild(SnMapDirective) map: SnMapDirective;
  @ViewChildren(SnMarkerDirective) branchMarkerList: QueryList<SnMarkerDirective>;
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
  branches: [LatLngLiteral] = [{ lat: 38.7396376, lng: -9.1694687 }];

  userPostion: LatLngLiteral;
  zoom = 15;
  showDrawer: boolean;
  showReCenter: boolean;

  private selectedBranch: AgmMarker;
  constructor(private service: BranchLocatorService) {

  }


  markerSelected(selected: SnMarkerDirective) {
    this.branchMarkerList.forEach((marker) => {
      if (marker.clickable) {
        if (marker.id() === selected.id()) {
          selected.iconUrl = this.branchSelectedIcon as any;
          selected.markerManager.updateIcon(selected);
          this.selectedBranch = selected;
          this.showDrawer =  Boolean(this.selectedBranch);
          selected.markerManager.getNativeMarker(selected).then((nativeMarker: any) => {
            const selectedPos: LatLngLiteral = {
              lat: nativeMarker.position.lat(),
              lng:  nativeMarker.position.lng()
            };
            this.map.api.panTo(selectedPos);
          });


        } else {
          marker.iconUrl = this.branchIcon as any;
          marker.markerManager.updateIcon(marker);
        }
      }
    });
  }


  mapClick(event: MouseEvent): void {
    if (this.selectedBranch) {
      this.resetMarkers();
    }
  }

  private resetMarkers() {
    this.branchMarkerList.filter((marker) => marker.clickable).forEach((marker) => {
      marker.iconUrl = this.branchIcon as any;
      marker.markerManager.updateIcon(marker);
    });
    this.selectedBranch = undefined;
    this.showDrawer =  Boolean(this.selectedBranch);
  }

  mapReady(): void {

    this.centerMapToUser();
    this.service.watchPosition().subscribe(
      (pos: Position) => {
        this.userPostion = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      });
  }


  centerChange(mapCenter: LatLngLiteral): void {

    if (this.userPostion && this.userPostion.lng && this.userPostion.lat) {
      this.showReCenter =
      this.roundCordinates(this.userPostion.lat) !== this.roundCordinates(mapCenter.lat)
      &&
      this.roundCordinates(this.userPostion.lng) !== this.roundCordinates(mapCenter.lng);
    }
  }


  private roundCordinates(cord: number) {
    return Math.round(cord * 1e7) / 1e7;
  }

  centerMapToUser() {
    this.service.getCurrentPosition()
      .subscribe((pos: Position) => {
        const newCenter = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.map.api.panTo(newCenter);
      });
  }


  drawerStageChange(state: DrawerState): void {

    if (state === DrawerState.Bottom) {
      this.showDrawer = false;
      console.log(this.showDrawer);

    }

  }

}
