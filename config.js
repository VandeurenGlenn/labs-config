'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = require('path');
var os = require('os');
var cryptoIoUtils = require('crypto-io-utils');
var uuid4 = _interopDefault(require('uuid/v4'));
var uuid5 = _interopDefault(require('uuid/v5'));

let file = {};
let configPath;
const defaultConfig = {
  "keys": {
    "public": "",
    "private": ""
  },
  "appdata": {
    "location": "%HOMEDIR%",
    "folder": ".revolutionlabs",
    "name": ".labsconfig"
  },
  "mining": {
    "pool": "labs.pool",
    "workers": [uuid5('labs.worker', uuid4())]
  }
};
const handleAppDataPath = appdata => {
  if (appdata.location === '%HOMEDIR%' || appdata.location === '%homedir%') {
    appdata.location = os.userInfo().homedir;
  }
  if (!appdata.name) {
    appdata.name = '.labsconfig';
  }
  return path.join(appdata.location, appdata.folder, appdata.name);
};
var index = (async () => {
  try {
    const result = await cryptoIoUtils.trymore(cryptoIoUtils.read, ['.labsconfig|json', `${path.join(os.userInfo().homedir, '.revolutionlabs', '.labsconfig')}|json`]);
    file = result[1];
    configPath = result[0];
    file.appdataPath = handleAppDataPath(file.appdata);
  } catch (error) {
    console.log(error);
    if (error.code === 'ENOENT') {
      file = defaultConfig;
      file.appdataPath = handleAppDataPath(file.appdata);
      await cryptoIoUtils.write(file.appdataPath, JSON.stringify(file, null, 2));
    } else {
      console.error(error);
      console.log(`Fix your .labsconfig file or run 'labs --init' using the cli`);
      process.exit();
    }
  }
  const obj = file;
  obj.set = (property, value) => {
    obj[property] = value;
    file[property] = value;
    return cryptoIoUtils.write(configPath, JSON.stringify(file, null, 2));
  };
  return obj;
})();

exports.defaultConfig = defaultConfig;
exports.handleAppDataPath = handleAppDataPath;
exports['default'] = index;
//# sourceMappingURL=config.js.map
