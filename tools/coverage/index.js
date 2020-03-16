(function() {
  const fs = require("fs");
  const path = require("path");
  const config = require("./const")();

  let _filePath = "";
  let cover = null;
  class Coverage {
    constructor(file) {
      this.setFile(file);
    }
    setFile(file) {
      if (file) {
        _filePath = file;
        cover = JSON.parse(loadFile(_filePath));
      }
    }
    getJSon() {
      return cover;
    }
    getResults() {
      return cover.total;
    }
    getTag(tag) {
      return cover.total[tag];
    }
    isBuilded() {
      return loadFile(config.buildFile) || "ko";
    }
    getConfigKarmaCoverage(file) {
      const karma = require(path.resolve(".") +
        "/" +
        (file || config.karmaFile));
      let values;
      const conf = {
        set: obj => {
          if (
            obj.coverageIstanbulReporter &&
            obj.coverageIstanbulReporter.thresholds
          ) {
            values = obj.coverageIstanbulReporter.thresholds;
          }
        }
      };
      karma(conf);
      return values;
    }
    getPackageVersion() {
      const pac = JSON.parse(loadFile("package.json"));
      return pac.version;
    }
    getPackageNextVersion() {
      const ver = this.getPackageVersion().split(".");
      ver[2] = parseInt(ver[2], 10) + 1;
      return ver.join(".");
    }
  }
  module.exports = Coverage;

  function loadFile(file) {
    const _file = path.join(path.resolve("."), file);
    if (fs.existsSync(_file)) {
      return fs.readFileSync(_file, "utf8");
    }
    return null;
  }
})();
