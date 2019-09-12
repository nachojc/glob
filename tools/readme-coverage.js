const PROJECT = require('../package.json');

const config = require('./coverage/const')(PROJECT['modules-publish'][0]);

const Coverage = require('./coverage');
const Readme = require('./coverage/readme');

const cov = new Coverage(config.jsonCoverageFile);
const red = new Readme();
const builded = cov.isBuilded().toLowerCase().indexOf('ok') !== -1;

red.setCoverage(cov.getResults());
const minCov = cov.getConfigKarmaCoverage();
red.setMinCoverage(minCov);
red.setCustomTag('Build', builded ? 'OK': 'KO',  builded? 'green': 'red')
red.setCustomTag('Version', cov.getPackageVersion(), 'green');
red.processCoverage();
console.log( 'Readme done...');
