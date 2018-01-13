const test = require('tape');
const config = require('./config.js');
const { readFileSync } = require('fs');

test('config', tape => {
  tape.plan(1);
  config.default.then(config => {
    try {
      readFileSync(config.appdataPath);
      tape.pass('config created');
    } catch (e) {
      tape.fail('config not created');
    }
  });
})
