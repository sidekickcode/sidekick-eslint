/**
 * Loads an eslint config from either a file or a JSON object in package.json
 * WARNING - relies on private module - API subject to change
 */
"use strict";

//not part of eslint's public API - so fetch by path
const esLintConfig = require('eslint/lib/config/config-file');

/**
 * Has the repo specified got any eslint config file (or section in package.json)
 * @param repoPath path to the repo
 * @returns {boolean}
 */
module.exports.hasConfigFile = function(repoPath){
  return esLintConfig.getFilenameForDirectory(repoPath) !== null;
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
