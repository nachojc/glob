import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  title = 'Branch Locator';
  externalDependencies = `npm install @agm/core -S
npm install @agm/js-marker-clusterer -S
npm install js-marker-clusterer -D`;
  dependencies = `
  import { AgmCoreModule } from '@agm/core';

  imports: [
    ...
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api.BranchLocator.googleApiKey,
      libraries: environment.api.BranchLocator.googleApiLibs || []
    }),
    ...
  ],
  ...
  providers: [
    { provide: 'WINDOW', useValue: window },
    { provide: 'ENV_CONFIG', useValue: environment },
    ...
   `;

 enviroment = `
 export const environment = {
    ...
    branchLocator: {
        apiURL: 'your api service url',
        googleApiKey: 'Google Api Key here',
        googleApiLibs: ['places'],
        languages: './',
        hasFilters: true,
    }
    ...
  };
 `;

  example = `
   ...
   <sn-branch-locator></sn-branch-locator>
   ...
  `;
  outputs = `<sn-branch-locator  (markerSelected)="markerSelected($event)" (mapBounds)="mapBounds($event)"></sn-branch-locator>`;

  outputExample1 = `
  markerSelected(event: OutputMarkerSelected) {
    OutputMarkerSelected = {
      marker: Details about the selected Marker,
      userPosition: User Position in LatLng
  }
  `;

  outputExample2 = `
  mapBounds(event: OutputMapBounds) {
    OutputMapBounds = {
      northEast: LatLngLiteral;
      southWest: LatLngLiteral;
  }
  `;

  serviceExample = `
  import { SnBranchLocatorService } from '@globile/branch-locator';
  constructor(
    ...
    private branchLocatorService: SnBranchLocatorService,
  ) { }

    this.branchLocatorService.getClosestBranchByTextQuery('Address or postal code').subscribe((res: Branch) => {
      ...
    }, err => {
      ...
    });
  `;

  inputs = `
  <sn-branch-locator [startingPosition]="{coordinates: {lat: -22.800861, lng: -47.08319689999996}}"></sn-branch-locator>
  <sn-branch-locator [startingPosition]="{text: 'address or postal code'}"></sn-branch-locator>
  `;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
