export const environment = {
  production: true,
  api: {
    BranchLocator: {
      apiURL: 'https://back-weu.azurewebsites.net/branch-locator',
      googleApiKey: 'AIzaSyAqG_sh5WdfA_ebgJLySpBejISPlNQPDl0',
      // googleApiKey: 'AIzaSyA62x0solApP7TErm0JoNFwHSiBKBongdA',
      googleApiLibs: ['places'],
      languages: './',
      hasFilters: true
    }
  }
};
