const fs = require('fs');
const path = require('path');

const proxyUrls = [
  '/find/defaultView',
  '/view/defaultView'
];

const replaceUrls = {
// '/api/me/accounts':'/me/accounts',
// '/api/me/cards':'/me/cards'
};
const PROXY_CONFIG = {
  "/api": {
    "secure": false,
    "bypass": function (req, res) {
      const tmp = req.url.split('?');
      if ( isInBaseUrl(tmp[0]) ) {
        
        const params = tmp.length > 1 ? tmp[1] : '';
        const file = replaceUrl(tmp[0]);

        if (fs.existsSync( path.join(__dirname, './mocks' , file , 'index.js'))) {
          res.end(require('./mocks' + file)(req, params) );
          return true;
        }
        // else{
        //   res.end( JSON.stringify({
        //     paths: path.join(__dirname, './mocks' , file , 'index.js'),
        //     result: fs.existsSync(path.join(__dirname, './mocks' , file , 'indes.js'))
        //   }));
        //   return true;
        // }
        
      }
    
      function isInBaseUrl(url) {
        const tmpUrl = url.split('?')[0];
        values = proxyUrls.filter(proxyUrl => tmpUrl.indexOf(proxyUrl) >= 0);
        return !!values.length;
      }
      function replaceUrl(url){
        for(path in replaceUrls){
          if(url.indexOf(path)!==-1){
            url = url.replace(path, replaceUrls[path]);
            break;
          }
        }
        return url;
      }
    }
  }
}

module.exports = PROXY_CONFIG;
