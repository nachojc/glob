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
  providers: [
    ...
    { provide: ENV_CONFIG, useValue: environment as EnvironmentConfigModel },
    { provide: 'WINDOW', useValue: window },
    ...
  ],
   `;

 enviroment = `
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

  constructor() { }

  ngOnInit() {
  }

}
