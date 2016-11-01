# Cakefile
#----------------------------------------------------------------------------

{exec} = require 'child_process'

#----------------------------------------------------------------------------

task 'check', 'Check dependency versions', ->
  project = require './package.json'
  for dependency of project.devDependencies
    checkVersion dependency, project.devDependencies[dependency]

task 'clean', 'Remove build cruft', ->
  clean()

task 'coverage', 'Perform test coverage analysis', ->
  clean -> compile -> test -> coverage()

#----------------------------------------------------------------------------

clean = (callback) ->
  exec 'rm -fR test', (err, stdout, stderr) ->
    throw err if err
    callback?()

compile = (callback) ->
  exec "node_modules/.bin/coffee -o test/ -c node/test", (err, stdout, stderr) ->
    throw err if err
    callback?()

coverage = (callback) ->
  exec 'node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --recursive', (err, stdout, stderr) ->
    throw err if err
    exec 'firefox --new-tab coverage/lcov-report/index.html', (err, stdout, stderr) ->
      throw err if err
      callback?()

test = (callback) ->
  exec 'node_modules/.bin/mocha --colors --recursive', (err, stdout, stderr) ->
    console.log stdout + stderr
    callback?() if stderr.indexOf("AssertionError") < 0

#----------------------------------------------------------------------------

checkVersion = (dependency, version) ->
  exec "npm --json info #{dependency}", (err, stdout, stderr) ->
    depInfo = JSON.parse stdout
    if depInfo['dist-tags'].latest isnt version
      console.log "[OLD] #{dependency} is out of date #{version} vs. #{depInfo['dist-tags'].latest}"

#----------------------------------------------------------------------------
# end of Cakefile
