const fs = require('fs');
const path = require('path');
const localPath = path.resolve('.');

const paths = {
    ANDROID: '../app/src/main/assets/www',
    IOS: '../GlobileWebComponent/www',
    LOCAL: './dist/BranchLocator'
}

class AssetRemedy {

    constructor(build = '') {
        let filePath;
        switch (build) {
            case 'ANDROID':
                filePath = path.join(localPath, paths.ANDROID);
                break;
            case 'IOS':
                filePath = path.join(localPath, paths.IOS);
                break;
            default:
                filePath = path.join(localPath, paths.LOCAL);
                break;
        }

        const files = this.getFileName(filePath);
        files.forEach( fl => {
            this.fixFile(filePath + '/' + fl);
            console.log('Fixed file: '+ fl);
        })
    }
    fixFile(file) {
        let result = fs.readFileSync(file, 'utf8');
        result = result.replace(/\/.\/assets\/fonts/g, './assets/fonts');
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    }
    getFileName(path){
        let result;
        let files = fs.readdirSync(path)
        
        for (var i in files) {
            const tx = files[i];
            if (tx.substring(tx.lastIndexOf('.')).toLowerCase() === '.css'){
                result = files[i];
            }
          }
          return result ? [result] : ['styles.js','styles.js.map'];
    }
}

module.exports = AssetRemedy;
