#!/usr/bin/env node
const PROJECT = require('../package.json');
const DIST_FOLDER = 'dist/'+ PROJECT['modules-publish'][0] +'/';
const FILE_TO_COPY=[
    // {input:'libs/sn-common-lib/src/atoms/icon/assets',output:'assets'},
    // {input:'libs/sn-common-lib/fonts',output:'assets/fonts'},
    // {input:'libs/sn-common-lib/styles',output:'styles'}
]

const fs = require('fs-extra');
var f = require('fs')
const path = require('path');

FILE_TO_COPY.forEach(folder =>{
    const destFolder = path.join( DIST_FOLDER , folder.output);
    var doesExist = f.existsSync(destFolder);
    if (!doesExist) {
        fs.mkdirSync(destFolder);
    }
    fs.copy(folder.input, destFolder, {clobber: true},function (err) {
        if (err){
            console.log('An error occured while copying the folder:' + folder.input )
            return console.error(err)
        }
        console.log('Copy completed!: "' + folder.input + '"');
    }); 
})