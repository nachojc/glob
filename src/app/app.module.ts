import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { SnBranchLocatorModule} from 'sn-branch-locator';


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ENV_CONFIG, EnvironmentConfigModel } from '@globile/mobile-services';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient, path: any) {
  return new TranslateHttpLoader(http, path.api.BranchLocator.languages + 'assets/i18n/branchlocator/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SnBranchLocatorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, ENV_CONFIG]
      }
    })
  ],
  providers: [
    { provide: ENV_CONFIG, useValue: environment as EnvironmentConfigModel },
    { provide: APP_BASE_HREF, useValue: './' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: 'WINDOW', useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
