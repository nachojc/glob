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
      googleApiKey: 'AIzaSyAEa5DdaHqV_b-40ErddBoWfEuopdvPK7I',
      googleApiLibs: ['geometry', 'visualization', 'places'],
      hasFilters: true,
    }
};
