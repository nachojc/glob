// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    BranchLocator: {
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
      // googleApiKey: 'AIzaSyAW6Ayoy5LzilIIwr84WfQFTybSV8P9Ifo',
      googleApiKey: 'AIzaSyAEa5DdaHqV_b-40ErddBoWfEuopdvPK7I',
      googleApiLibs: ['weather', 'geometry', 'visualization', 'places'],
      languages: '/i18n/branchlocator/',
      hasFilters: true,
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
