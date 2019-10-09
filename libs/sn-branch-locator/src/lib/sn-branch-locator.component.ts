import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { SnMapDirective } from './components/branch-locator/directives/sn-map/sn-map.directive';
import { LatLngLiteral } from '@agm/core';
import { BranchLocatorService } from './components/branch-locator/branch-locator.service';
import { DrawerState } from './components/sn-drawer/models/sn-drawer-state.model';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { Branch } from './models/branch.model';
import { SnBranchLocatorService } from './sn-branch-locator.service';
import { TranslateService } from '@ngx-translate/core';


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
  branches: LatLngLiteral[] = [{lat: -23.6102161, lng: -46.6967274}, { lat: 38.7396376, lng: -9.1694687 }];
  branchesList: Branch[];

  userPostion: LatLngLiteral;
  zoom = 15;
  showDrawer: boolean;
  showReCenter: boolean;

  private selectedMarker: SnMarkerDirective;
  selectedBranch: Branch;
  selectedTabIndex: number;

  constructor(
    private service: BranchLocatorService,
    private branchService: SnBranchLocatorService,
    // private translate: TranslateService
  ) {
    this.getBranchesFromService();
  }

  // TODO: remove. Created for testing propose
  getBranchesFromService() {
    this.branchService.getBranches().subscribe(res => {
      this.branchesList = res;
    }, err => {
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

  // private resetMarkers() {
  //   this.branchMarkerList.filter((marker) => marker.clickable).forEach((marker) => {
  //     marker.iconUrl = this.branchIcon as any;
  //     marker.markerManager.updateIcon(marker);
  //   });
  //   this.selectedMarker = undefined;
  //   this.showDrawer =  Boolean(this.selectedMarker);
  // }

  mapReady(): void {

    this.centerMapToUser();
    this.service.watchPosition().subscribe(
      (pos: Position) => {
        this.userPostion = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      }
    );
  }


  centerChange(mapCenter: LatLngLiteral): void {

    if (this.userPostion && this.userPostion.lng && this.userPostion.lat) {
      // tslint:disable-next-line: max-line-length
      this.showReCenter = ((this.roundCordinates(this.userPostion.lng) !== this.roundCordinates(mapCenter.lng)) && (this.roundCordinates(this.userPostion.lat) !== this.roundCordinates(mapCenter.lat)));
    } else {
      this.showReCenter = false;
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
