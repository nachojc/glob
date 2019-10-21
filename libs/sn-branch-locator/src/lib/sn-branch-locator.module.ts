import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, ButtonModule, OptionListModule, SnTabModule, LoadingModule, LoaderModule } from 'sn-common-lib';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { EnvironmentConfigModel, ENV_CONFIG } from '@globile/mobile-services';

import { SnMapDirective } from './directives/sn-map/sn-map.directive';
import { SnMarkerDirective } from './directives/sn-marker/sn-marker.directive';
import { SnBranchLocatorComponent } from './components/branch-locator/sn-branch-locator.component';
import { BranchSearchInputModule } from './components/branch-search-input/branch-search-input.module';
import { SnBranchInfoComponent } from './components/sn-branch-info/sn-branch-info.component';
import { FilterModule } from './components/filter/filter.module';
import { DrawerModule } from './components/sn-drawer';
import { BranchListComponent } from './components/branch-list/branch-list.component';

// TODO: path Update EnvironmentConfigModel
export function LocalLoaderFactory(http: HttpClient, path: any) {
  return new TranslateHttpLoader(http, path.api.BranchLocator['languages'] + 'assets/i18n/branchlocator/', '.json');
}

@NgModule({
  declarations: [
    SnBranchLocatorComponent,
    SnMapDirective,
    SnBranchInfoComponent,
    SnMarkerDirective,
    BranchListComponent],
  imports: [
    CommonModule,
    OptionListModule,
    IconModule,
    ButtonModule,
    HttpClientModule,
    SnTabModule,
    BranchSearchInputModule,
    OptionListModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: LocalLoaderFactory,
        deps: [HttpClient, ENV_CONFIG]
      }
    }),
    AgmCoreModule,
    DrawerModule,
    FilterModule,
    LoadingModule,
    LoaderModule,
    AgmJsMarkerClustererModule,
  ],
  exports: [
    SnBranchLocatorComponent,
  ]
})
export class SnBranchLocatorModule { }
