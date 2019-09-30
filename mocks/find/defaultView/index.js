const fs = require('fs');
const path = require('path');


module.exports = function (req, params) {
    let file;
    if (params.indexOf('southWest') !== -1){
        file =`json/index2.json`;
    }else{
        file = `json/index2.json`;

    }
    
    return fs.readFileSync( path.join(__dirname , file), 'utf8');;

}