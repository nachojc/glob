// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const browser = process.env.BROWSER || 'Chrome';
  let browsers = 'Chrome';
  const plugins = [
    require('karma-jasmine'),
    require('karma-jasmine-html-reporter'),
    require('karma-coverage-istanbul-reporter'),

    require('@angular-devkit/build-angular/plugins/karma'),
    require('karma-chrome-launcher')

  ];
  if (browser === 'NONE') {
    browsers = 'ChromeHeadless';
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins,
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage/sn-branch-locator'),
      reports: ['json-summary', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 75,
        functions: 80
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    proxies:{
      '/assets/fonts/sn-icons.woff': 'node_modules/sn-common-lib/assets/fonts/sn-icons.woff',
      '/assets/fonts/sn-icons.ttf': 'node_modules/sn-common-lib/assets/fonts/sn-icons.ttf'
    },
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222',
        ]
      }
    },
    browsers:[ browsers ],
    singleRun: false,
    restartOnFileChange: true
  });
};
