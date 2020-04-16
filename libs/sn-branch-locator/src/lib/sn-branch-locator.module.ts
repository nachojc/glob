import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import {
  IconModule,
  ButtonModule,
  OptionListModule,
  LoadingModule,
  LoaderModule
} from 'sn-common-lib';
import { ENV_CONFIG, BridgeAnalyticService } from '@globile/mobile-services';

import { SnMapDirective } from './directives/sn-map/sn-map.directive';
import { SnMarkerDirective } from './directives/sn-marker/sn-marker.directive';
import { SnBranchLocatorComponent } from './components/branch-locator/sn-branch-locator.component';
import { BranchSearchInputModule } from './components/branch-search/branch-search.module';
import { SnBranchInfoComponent } from './components/sn-branch-info/sn-branch-info.component';
import { FilterModule } from './components/filter/filter.module';
import { DrawerModule } from './components/sn-drawer';
import { BranchListComponent } from './components/branch-list/branch-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { SnTabModule } from './components/tabs/sn-tab.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SnDirectionModule } from './directives/sn-direction/sn-direction.module';
import { SnBranchDirectionComponent } from './components/sn-branch-direction/sn-branch-direction.component';
import { SafePipe } from './pipes/safe.pipe';
import { GlobileSettingsService } from '@globile/mobile-services';

// TODO: path Update EnvironmentConfigModel
export function LocalLoaderFactory(http: HttpClient, globileSettings: GlobileSettingsService) {
  return new TranslateHttpLoader(http, globileSettings.branchLocator.languages, '.json');
}

@NgModule({
  declarations: [
    SnBranchLocatorComponent,
    SnMapDirective,
    SnBranchInfoComponent,
    SnMarkerDirective,
    MenuComponent,
    BranchListComponent,
    SnBranchDirectionComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    OptionListModule,
    IconModule,
    ButtonModule,
    SnTabModule,
    BranchSearchInputModule,
    OptionListModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: LocalLoaderFactory,
        deps: [HttpClient, GlobileSettingsService]
      }
    }),
    DrawerModule,
    FilterModule,
    LoadingModule,
    LoaderModule,
    SnDirectionModule
  ],
  providers: [TranslateService, BridgeAnalyticService],
  exports: [SnBranchLocatorComponent]
})
export class SnBranchLocatorModule { }
