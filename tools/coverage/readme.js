(function () {
    const fs = require('fs');
    const path = require('path');
    const config = require('./const')();
    


    let _filePath = 'README.md';
    let _file, _cov, _monCov;
    class ReadmeClass {
        constructor(file){
            _filePath = file || _filePath;
            this.setFile(_filePath);
        }
        setFile(file){
            if(file){
                _filePath = file; 
                _file = loadFile(_filePath);
            }
        }
        setCoverage(coverage){
            _cov = coverage;
        }
        setMinCoverage(coverage){
            _monCov = coverage;
        }
        setCustomTag(idTag, value, colour){
            const tag = getCustomTag(value, colour, idTag);
                        
            this.replaceTag(idTag, tag);
        }
        processCoverage(colour, coverage){
            colour = colour || 'green';
            if (coverage) this.setCoverage(coverage);
            if (_cov){
                for (const key in _cov) {
                    const element = _cov[key];
                    const idTag = key[0].toUpperCase() + key.substr(1);
                    if(this.existTag(idTag)){
                        const locCol = _monCov && _monCov[key] ? 
                            parseFloat(_monCov[key]) > parseFloat(element.pct) ? 
                                'red' : 'green' : colour;
                        const tag = getTag(element.pct, locCol, idTag);
                        
                        this.replaceTag(idTag, tag);
                    };
                }
                saveFile();
            }
        }
        existTag(idTag) {
            const regExp    =  new RegExp('<img.*id="'+ idTag +'".*?>' );
            return regExp.test(_file);
        }
        replaceTag(idTag, newTag) {
            const regExp    =  new RegExp('<img.*id="'+ idTag +'".*?>' );
            _file = _file.replace(regExp, newTag);
        }
    }
    module.exports = ReadmeClass;



    function getTag(cov, colour, idTag) {
        const url = config.getCoverageUrl(cov, colour);

        return `<img id="${idTag}" src="${url}" alt="${idTag.toLowerCase()} coverage">`;
    }
    function getCustomTag(cov, colour, idTag) {
        const url = config.getBuildUrl(idTag, cov, colour);

        return `<img id="${idTag}" src="${url}" alt="${idTag.toLowerCase()}">`;
    }

    function loadFile(file) {
        if(file){
            const _file = path.join( path.resolve("."), file);
            if (fs.existsSync(_file)){
                return fs.readFileSync(_file, 'utf8');
            }
        }
        return null;
    }
    function saveFile(file, value) {
        file = file || _filePath;
        value = value || _file;
        
        const _fileOut = path.join( path.resolve("."), file);
        fs.writeFileSync( _fileOut, value ,'utf8');
        console.log(`Save file: ${_fileOut}`);
                
    }
}());
