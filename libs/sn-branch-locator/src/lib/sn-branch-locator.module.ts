import { NgModule } from '@angular/core';
import { SnBranchLocatorComponent } from './components/branch-locator/sn-branch-locator.component';
import { SnMapDirective } from './directives/sn-map/sn-map.directive';
import { CommonModule } from '@angular/common';
import { IconModule, ButtonModule, OptionListModule, SnTabModule, DrawerModule } from 'sn-common-lib';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { SnMarkerDirective } from './directives/sn-marker/sn-marker.directive';
import { BranchSearchInputModule } from './components/branch-search-input/branch-search-input.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SnBranchInfoComponent } from './components/sn-branch-info/sn-branch-info.component';
import { EnvironmentConfigModel, ENV_CONFIG } from '@globile/mobile-services';

export function LocalLoaderFactory(http: HttpClient, path: EnvironmentConfigModel) {
  return new TranslateHttpLoader(http, path.api.BranchLocator['languages'] + 'assets/i18n/branchlocator/', '.json');
}

@NgModule({
  declarations: [
    SnBranchLocatorComponent,
    SnMapDirective,
    SnBranchInfoComponent,
    SnMarkerDirective],
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
    AgmCoreModule.forRoot({}),
    DrawerModule
  ],
  exports: [
    SnBranchLocatorComponent,
  ]
})
export class SnBranchLocatorModule { }
