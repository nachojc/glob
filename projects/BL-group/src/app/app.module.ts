import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SnBranchLocatorModule } from '@globile/branch-locator';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { ENV_CONFIG, EnvironmentConfigModel } from '@globile/mobile-services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrismModule } from './components/prism/prism.module';
import { RouterModule } from '@angular/router';

export function HttpLoaderFactory(http: HttpClient, path: any) {
  return new TranslateHttpLoader(http, path.api.BranchLocator['languages'], '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    SnBranchLocatorModule,
    PrismModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api.BranchLocator.googleApiKey,
      libraries: environment.api.BranchLocator.googleApiLibs || []
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, ENV_CONFIG]
      }
    }),
    RouterModule.forRoot([])
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
