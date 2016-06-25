/**
 * Loads an eslint config from either a file or a JSON object in package.json
 * WARNING - relies on private module - API subject to change
 */
"use strict";

const log = require('debug')('configLoader');
const fs = require('fs');
const Promise = require('bluebird');

const readFileAsync = Promise.promisify(fs.readFile);

//not part of eslint's public API - so fetch by path
const esLintConfig = require('eslint/lib/config/config-file');

/**
 * Has the repo specified got any eslint config file (or section in package.json)
 * @param repoPath path to the repo
 * @returns {boolean}
 */
module.exports.hasConfigFile = function(repoPath){
  return new Promise(function(resolve, reject){
    const configFile = esLintConfig.getFilenameForDirectory(repoPath);
    log(`Config file: ${configFile}`);
    if(configFile && configFile.endsWith('/package.json')) {
      log('Using package.json for eslint config');
      readFileAsync(configFile)
          .then((fileContents) => {
            log('have loaded package.json');
            const packageJson = JSON.parse(fileContents);
            resolve(packageJson['eslintConfig'] !== undefined);
          });
    } else {
      resolve(configFile !== null);
    }
  });
};

/**
 * fetch the eslint config for a repo
 * @param repoPath the path to the repo
 * @returns {Object} eslint config
 */
module.exports.loadConfig = function(repoPath){
  var configFile = esLintConfig.getFilenameForDirectory(repoPath);
  if(configFile){
    var overrideWithEnv = true;
    return esLintConfig.load(configFile, overrideWithEnv);
  }
};
