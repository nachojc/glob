import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  title = 'Branch Locator';
  dependencies = `
  providers: [
    ...
    { provide: ENV_CONFIG, useValue: environment as EnvironmentConfigModel },
    { provide: 'WINDOW', useValue: window }
    ...
   ],
   `;

   imports = `
   imports: [
     ...
   SnBranchLocatorModule,
   AgmCoreModule.forRoot({
     apiKey: environment.api.BranchLocator.googleApiKey,
     libraries: environment.api.BranchLocator.googleApiLibs || []
   }),
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
      languages: './'
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


  constructor() { }

  ngOnInit() {
  }

}
