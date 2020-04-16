# BranchLocator
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Build" src="https://img.shields.io/badge/Build-OK-green.svg" alt="build"></a>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Version" src="https://img.shields.io/badge/Version-1.0.27-green.svg" alt="version"></a>
<table id="Coverage">
<tr><td>Statements</td><td>Branches</td><td>Functions</td><td>Lines</td></tr>
<tr>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Statements" src="https://img.shields.io/badge/Coverage-90.29%25-green.svg" alt="statements coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Branches" src="https://img.shields.io/badge/Coverage-76.87%25-green.svg" alt="branches coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Functions" src="https://img.shields.io/badge/Coverage-83.64%25-green.svg" alt="functions coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Lines" src="https://img.shields.io/badge/Coverage-89.99%25-green.svg" alt="lines coverage"></a>
</td>
</tr>
</table>

## Url registry
First at all, you must add next URL registry before start dowloading the lib:
http://nexus.alm.europe.cloudcenter.corp/repository/blue4sky-npm-group/

## Download
Add in the main module the following imports:
```typescript
import { AgmCoreModule } from "@agm/core";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { GlobileSettingsService, GlobileModule } from '@globile/mobile-services';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SnBranchLocatorModule } from "sn-branch-locator";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient, globileSettings: GlobileSettingsService) {
  return new TranslateHttpLoader(http, globileSettings.branchLocator.languages, '.json');
}
```
```js
imports: [
    ...
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    SnBranchLocatorModule,
    AgmCoreModule.forRoot({
      apiKey: environment.branchLocator.googleApiKey,
      libraries: environment.branchLocator.googleApiLibs || []
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, GlobileSettingsService]
      }
    }),
    GlobileModule.forRoot({}, environment),
    ...
  ],
```
## Config EnvironmentConfigModel in enviroment.ts
The environments needs to been setup by the EnvironmentConfigModel
```js
export const environment = {
  ...
  branchLocator: {
    endpoints: [
      {
        URL: 'your url endpoint 1',
        lat: 29.4247,
        lng: -98.4935
      },
      {
        URL: 'your url endpoint 2',
        lat: 52.35,
        lng: 4.9167
      },
    ],
    googleApiKey: 'Google Api Key here',
    googleApiLibs: ['weather', 'geometry', 'visualization', 'places'],
    languages: '/i18n/branchlocator/',
    hasFilters: true,
  }
  ...
};
```
## Config angular.json
Add in assets part next code:
```json
 {
      "glob": "**/*",
      "input": "node_modules/sn-common-lib/assets/fonts/",
      "output": "assets/fonts/"
    },
    {
      "glob": "**/*",
      "input": "node_modules/@globile/branch-locator/assets",
      "output": "assets/branchlocator/"
    },
    {
      "glob": "**/*",
      "input": "node_modules/@globile/branch-locator/i18n",
      "output": "/i18n/branchlocator/"
    }
```
and in style part:
```json
"node_modules/sn-common-lib/styles/styles.scss"
```
don't forget to initialize the translation default language in your app:
```typescript
constructor(private trasnlate: TranslateService) {}
  ngOnInit() {
    this.trasnlate.setDefaultLang('es');
  }
```
## Getting Started
How to use branch locator component:
```html
...
<sn-branch-locator></sn-branch-locator>
...
```
## Outputs
Optional outputs for branch locator
```html
<sn-branch-locator
  (markerSelected)="markerSelected($event)"
  (mapBounds)="mapBounds($event)"
></sn-branch-locator>
```
Emits everytime user selects a marker on the map and return an object with information about the
marker and user position:
```js
 markerSelected(event: OutputMarkerSelected) {
    OutputMarkerSelected = {
      marker: Details about the selected Marker,
      userPosition: User Position in LatLng
  }
```
Emits everytime user move the map and return an object with the new map bounds
```js
mapBounds(event: OutputMapBounds) {
    OutputMapBounds = {
      northEast: LatLngLiteral;
      southWest: LatLngLiteral;
  }
```
Get the closest branch to a ZIP code/address
```js
const closetsBranch;
this.branchLocatorService.getClosestBranchByTextQuery('mk89df').subscribe(branch => {
    closetsBranch = branch;
});
```
