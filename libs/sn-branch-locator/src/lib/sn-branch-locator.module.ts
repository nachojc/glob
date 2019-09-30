import { NgModule } from '@angular/core';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { SnMapDirective } from './components/branch-locator/directives/sn-map/sn-map.directive';
import { SnBranchInfoComponent } from './components/branch-locator/sn-branch-info/sn-branch-info.component';
import { CommonModule } from '@angular/common';
import { IconModule, ButtonModule, OptionListModule } from 'sn-common-lib';
import { HttpClientModule } from '@angular/common/http';
import { SnTabModule } from './components/tabs/sn-tab.module';
import { SnDrawerModule } from './components/sn-drawer/sn-drawer.module';
import { AgmCoreModule } from '@agm/core';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { SnBranchSearchInputComponent } from './components/sn-branch-search-input/sn-branch-search-input.component';

@NgModule({
  declarations: [SnBranchLocatorComponent, SnMapDirective, SnBranchInfoComponent, SnMarkerDirective, SnBranchSearchInputComponent],
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    HttpClientModule,
    SnTabModule,
    SnDrawerModule,
    OptionListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCCOzVlRBrfWv06M6pHNtlkmcmuemXneAM'
    })
  ],
  exports: [SnBranchLocatorComponent]
})
export class SnBranchLocatorModule { }
