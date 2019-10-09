import { NgModule } from '@angular/core';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { SnMapDirective } from './components/branch-locator/directives/sn-map/sn-map.directive';
import { SnBranchInfoComponent } from './components/branch-locator/sn-branch-info/sn-branch-info.component';
import { CommonModule } from '@angular/common';
import { IconModule, ButtonModule, OptionListModule, SnTabModule } from 'sn-common-lib';
import { HttpClientModule } from '@angular/common/http';
import { SnDrawerModule } from './components/sn-drawer/sn-drawer.module';
import { AgmCoreModule } from '@agm/core';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { BranchSearchInputModule } from './components/branch-search-input/branch-search-input.module';

@NgModule({
  declarations: [SnBranchLocatorComponent, SnMapDirective, SnBranchInfoComponent, SnMarkerDirective],
  imports: [
    CommonModule,
    OptionListModule,
    IconModule,
    ButtonModule,
    HttpClientModule,
    SnTabModule,
    SnDrawerModule,
    BranchSearchInputModule,
    OptionListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAqG_sh5WdfA_ebgJLySpBejISPlNQPDl0',
      libraries: ['places']
    })
  ],
  exports: [SnBranchLocatorComponent]
})
export class SnBranchLocatorModule { }
