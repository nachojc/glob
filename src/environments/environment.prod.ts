export const environment = {
  production: true,
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
    labelsEndpoint : 'https://branchlocator.santander.com/translations/translation-${lang}.json',
      googleApiKey: 'AIzaSyAW6Ayoy5LzilIIwr84WfQFTybSV8P9Ifo',
      googleApiLibs: ['weather', 'geometry', 'visualization', 'places'],
      languages: '/i18n/branchlocator/',
      hasFilters: true
    }
};
