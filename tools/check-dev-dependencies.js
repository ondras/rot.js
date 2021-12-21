var checkVersion, exec, execAsync, exitCode;

exitCode = 0;

({exec} = require("child_process"));

execAsync = function(command) {
  return new Promise(function(resolve, reject) {
    return exec(command, function(err, stdout, stderr) {
      if (err != null) {
        return reject(err);
      }
      return resolve({
        stdout: stdout,
        stderr: stderr
      });
    });
  });
};

checkVersion = async function(dependency, version) {
  var latest, stdout;
  ({stdout} = (await execAsync(`npm --json info ${dependency}`)));
  ({latest} = JSON.parse(stdout)["dist-tags"]);
  if (latest !== version) {
    exitCode = 1;
    return console.log(`[OLD] ${dependency} is out of date ${version} vs. ${latest}`);
  }
};

(async function() {
  var dependency, project;
  project = require("../package.json");
  for (dependency in project.devDependencies) {
    await checkVersion(dependency, project.devDependencies[dependency]);
  }
  process.exit(exitCode)
})();
