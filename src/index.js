import { join } from 'path';
import { userInfo } from 'os';
import { read, write, trymore } from 'crypto-io-utils';
import uuid4 from 'uuid/v4';
import uuid5 from 'uuid/v5';
let file = {};
let appdataPath = '';
let configPath;

export const defaultConfig = {
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
    "workers": [
      uuid5('labs.worker', uuid4())
    ]
  }
}



export const handleAppDataPath = appdata => {
  if (appdata.location === '%HOMEDIR%' || appdata.location === '%homedir%') {
    appdata.location = userInfo().homedir;
  }
  if (!appdata.name) {
    appdata.name = '.labsconfig';
  }
  return join(appdata.location, appdata.folder, appdata.name);
}

export default (async () => {
  try {
    const result = await trymore(read, [
      '.labsconfig|json',
      `${join(userInfo().homedir, '.revolutionlabs', '.labsconfig')}|json`
    ]);
    file = result[1];
    configPath = result[0];
    file.appdataPath = handleAppDataPath(file.appdata);
  } catch (error) {
    if (error.code === 'ENOENT') {
      file = defaultConfig;
      file.appdataPath = handleAppDataPath(file.appdata);
      await write(file.appdataPath, JSON.stringify(file, null, 2));
    } else {
      console.error(error);
      console.log(`Fix your .labsconfig file or run 'labs --init' using the cli`);
      process.exit();
    };
  }
  const obj = file;
  obj.set = (property, value) => {
    obj[property] = value;
    file[property] = value;
    return write(configPath, JSON.stringify(file, null, 2));
  };
  return obj;
})();
