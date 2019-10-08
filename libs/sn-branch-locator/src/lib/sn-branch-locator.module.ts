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
import { LanguagesModule } from './languages/languages.module';
import { LanguageLoader, DefLanguageHttpLoader } from './languages/lib/languages.loader';


export function LocalLoaderFactory(http: HttpClient) {
  return new DefLanguageHttpLoader(http, '/assets/i18n/', '.json', 'branch');
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
    LanguagesModule.forChild({
      loader: {
        provide: LanguageLoader,
        useFactory: LocalLoaderFactory,
        deps: [HttpClient]
      },
      useDefaultLang: 'es'
    })
  ],
  exports: [
    SnBranchLocatorComponent,
  ]
})
export class SnBranchLocatorModule { }
