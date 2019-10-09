import { NgModule } from '@angular/core';
import { SnBranchLocatorComponent } from './sn-branch-locator.component';
import { SnMapDirective } from './components/branch-locator/directives/sn-map/sn-map.directive';
import { SnBranchInfoComponent } from './components/branch-locator/sn-branch-info/sn-branch-info.component';
import { CommonModule } from '@angular/common';
import { IconModule, ButtonModule, OptionListModule, SnTabModule } from 'sn-common-lib';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SnDrawerModule } from './components/sn-drawer/sn-drawer.module';
import { AgmCoreModule } from '@agm/core';
import { SnMarkerDirective } from './components/branch-locator/directives/sn-marker/sn-marker.directive';
import { SnBranchSearchInputComponent } from './components/sn-branch-search-input/sn-branch-search-input.component';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function LocalLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/branchlocator/', '.json');
}

@NgModule({
  declarations: [SnBranchLocatorComponent, SnMapDirective, SnBranchInfoComponent, SnMarkerDirective, SnBranchSearchInputComponent],
  imports: [
    CommonModule,
    OptionListModule,
    IconModule,
    ButtonModule,
    HttpClientModule,
    SnTabModule,
    SnDrawerModule,
    OptionListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAqG_sh5WdfA_ebgJLySpBejISPlNQPDl0'
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: LocalLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    SnBranchLocatorComponent,
  ]
})
export class SnBranchLocatorModule { }
