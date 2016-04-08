"use strict";

const sidekickAnalyser = require("@sidekick/analyser-common");
const fs = require('fs');

const stripJsonComments = require("strip-json-comments");
const eslint = require('eslint');
const debug = require('debug')('eslint');

const annotationDefaults = {analyserName: 'eslint'};
const configFileName = '.eslintrc';

if(require.main === module) {
  execute();
}
module.exports = exports = execute;

function execute() {
  sidekickAnalyser(function(setup) {
    var config;

    debug('setup: ' + JSON.stringify(setup));
    var conf = (setup.configFiles || {})[configFileName];
    if(conf) {
      try {
        config = JSON.parse(stripJsonComments(conf));
        debug('using config: ' + JSON.stringify(config));
      } catch(e) {
        debug('config parsing failed: ' + e.message);
        // FIXME need some way of signalling
        console.error("can't parse config");
        console.error(e);
      }
    }

    if(!config) {
      config = {};
      debug('using default config');
    }

    var results = run(setup.content, config);
    console.log(JSON.stringify({ meta: results }));
  });
}

function run(content, config) {
  try {
    var errors = eslint.linter.verify(content, config);
    return errors.map(format);
  } catch (err) {
    console.error("failed to analyse");
    console.log({ error: err });
    process.exit(1);
  }
}

function format(error) {
  var line = error.line - 1;
  var col = error.column - 1;
  return {
    analyser: annotationDefaults.analyserName,
    location: {
      startLine: line,
      endLine: line,
      startCharacter: col,
      endCharacter: col,
    },
    message: error.message,
    kind: error.ruleId,
  };
}
