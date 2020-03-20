# BranchLocator

<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Build" src="https://img.shields.io/badge/Build-OK-green.svg" alt="build"></a>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Version" src="https://img.shields.io/badge/Version-1.0.8-green.svg" alt="version"></a>

<table id="Coverage">
<tr><td>Statements</td><td>Branches</td><td>Functions</td><td>Lines</td></tr>
<tr>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Statements" src="https://img.shields.io/badge/Coverage-91.67%25-green.svg" alt="statements coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Branches" src="https://img.shields.io/badge/Coverage-79.08%25-green.svg" alt="branches coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Functions" src="https://img.shields.io/badge/Coverage-85.77%25-green.svg" alt="functions coverage"></a>
</td>
<td>
<a href="https://nexus.devops.blue4sky.com/" rel="nofollow"><img id="Lines" src="https://img.shields.io/badge/Coverage-91.13%25-green.svg" alt="lines coverage"></a>
</td>
</tr>
</table>

## Download

Need to install agm/core:

```npm
npm install @agm/core --save
```

Then add in the main module the following imports and providers:

```typescript
import { SnBranchLocatorModule } from "sn-branch-locator";
import { AgmCoreModule } from "@agm/core";
```

```js
imports: [
    ...
    SnBranchLocatorModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api.BranchLocator.googleApiKey,
      libraries: environment.api.BranchLocator.googleApiLibs || []
    }),
    ...
  ],
  providers: [
    ...
    { provide: ENV_CONFIG, useValue: environment as EnvironmentConfigModel },
    { provide: 'WINDOW', useValue: window },
    ...
  ],
```

## Config EnvironmentConfigModel in enviroment.ts

The environments needs to been setup by the EnvironmentConfigModel

```js
export const environment = {
    ...
    api: {
      ...
      BranchLocator: {
        apiURL: 'your api service url',
        googleApiKey: 'Google Api Key here',
        googleApiLibs: ['places'],
        languages: './',
        hasFilters: true,
      }
      ...
    }
  };
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
