const fs = require('fs');
const path = require('path');

module.exports = function (req, params) {
    
    return fs.readFileSync( path.join(__dirname , `json/index.json`), 'utf8');;
}