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
      apiKey: environment.branchLocator.googleApiKey,
      libraries: environment.branchLocator.googleApiLibs || []
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
      endpoints: [
        {
          URL: 'https://back-scus.azurewebsites.net/branch-locator',
          lat: 29.4247,
          lng: -98.4935
        },
        {
          URL: 'https://back-weu.azurewebsites.net/branch-locator',
          lat: 52.35,
          lng: 4.9167
        },
      ],
      labelsEndpoint : 'https://branchlocator.santander.com/translations/translation-` + '${lang}' + `.json',
      googleApiKey: 'AIzaSyAEa5DdaHqV_b-40ErddBoWfEuopdvPK7I',
      googleApiLibs: ['geometry', 'visualization', 'places'],
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
      southWest: La tLngLiteral;
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
    <!-- Region code, used to fetch locale params from configuration server -->
    <sn-branch-locator [viewRegion]="'pl'"></sn-branch-locator>

    <!-- Branch types, if provided, only these will be shown -->
    <sn-branch-locator [branchTypes]="'BRANCH'"></sn-branch-locator>

     <!-- Initial position -->
    <sn-branch-locator [coordinates]="{lat: -22.800861, lng: -47.08319689999996}"></sn-branch-locator>
    <sn-branch-locator [address]="'address or postal code'"></sn-branch-locator>

  `;

  constructor(
  ) {
  }

  ngOnInit() {
  }
}
