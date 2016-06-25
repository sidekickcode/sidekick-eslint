var chai = require('chai');
var expect = chai.expect;

var cl = require('../configLoader');

var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('eslint config loader', function() {

  describe('positive tests', function () {

    var fixturesDir = path.join(__dirname, '/fixtures');

    beforeEach(function(){
      fs.mkdirsSync(fixturesDir);
    });
    afterEach(function(){
      fs.removeSync(fixturesDir);
    });

    it('finds config file', function () {
      fs.writeFileSync(path.join(fixturesDir, '.eslintrc'), 'hello world', {encoding: 'utf-8'});
      expect(cl.hasConfigFile(fixturesDir)).to.eventually.be.true;
    });

    it('finds config section in package.json', function () {
      fs.writeFileSync(path.join(fixturesDir, 'package.json'), '{"eslintConfig": {}}', {encoding: 'utf-8'});
      expect(cl.hasConfigFile(fixturesDir)).to.eventually.be.true;
    });

    it('finds loads a valid config', function () {
      var testConfig = fs.readFileSync(path.join(__dirname, '/.eslintrc.json'), {encoding: 'utf-8'});
      var config = cl.loadConfig(__dirname);
      expect(config.rules).to.deep.equal(JSON.parse(testConfig).rules);  //loading adds some props - just test rules
    });
    
  });

  describe('negative tests', function () {

    var fixturesDir = path.join(__dirname, '/fixtures');

    beforeEach(function(){
      fs.mkdirsSync(fixturesDir);
    });
    afterEach(function(){
      fs.removeSync(fixturesDir);
    });

    it('fails for a non-existent dir', function () {
      expect(cl.hasConfigFile(fixturesDir)).to.eventually.be.false;
    });

    it('knows when there is no config files available', function () {
      expect(cl.hasConfigFile(fixturesDir)).to.eventually.be.false;
    });

    it('fails for package.json that does not contain eslintConfig section', function () {
      fs.writeFileSync(path.join(fixturesDir, 'package.json'), '{"hello": {}}', {encoding: 'utf-8'});
      expect(cl.hasConfigFile(fixturesDir)).to.eventually.be.false;
    });

  });
});
