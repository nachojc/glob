(function() {
  let project;
  const constants = pro => {
    project = pro || project;
    return {
      project: project,
      buildFile: "./.buildstatus",
      karmaFile: `libs/${project}/karma.conf.js`,
      getBuildUrl: getBuildUrl,
      getCoverageUrl: (coverage, color) =>
        getBuildUrl("Coverage", coverage + encodeURI("%"), color),
      jsonCoverageFile: `coverage/${project}/coverage-summary.json`,
      readmeFile: "README.md"
    };
  };

  function getBuildUrl(left, right, color) {
    return `https://img.shields.io/badge/${left}-${right}-${color}.svg`;
  }

  module.exports = constants;
})();
