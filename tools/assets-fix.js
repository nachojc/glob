#!/usr/bin/env node
const PROJECT = require('../package.json');
const DIST_FOLDER = 'dist/'+ PROJECT['modules-publish'][0] +'/';
const FILE_TO_COPY=[
    {input:'libs/sn-branch-locator/src/assets/branchlocator',output:'assets'},
    // {input:'libs/sn-branch-locator/i18n/branchlocator',output:'i18n'}
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

const pars = process.argv;
if (pars.length > 2){
    const AssetRemedy = require('./assets');
    
    new AssetRemedy(pars[2]);
}