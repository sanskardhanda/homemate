'use strict';

const HomeMate3Plus1Accessory = require('./accessories/HomeMate3Plus1Accessory');

const PLUGIN_NAME = 'homebridge-homemate';
const PLATFORM_NAME = 'TuyaHomeMate';

const HOMEMATE_LIGHTS = [
  { name: 'Light 1', dp: 1 },
  { name: 'Light 2', dp: 2 },
  { name: 'Light 3', dp: 3 },
];

const HOMEMATE_FAN = {
  name: 'Fan',
  dpSwitch: 101,
  dpSpeed: 102,
  speedValues: ['level_1', 'level_2', 'level_3', 'level_4'],
};

module.exports = (homebridge) => {
  homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, TuyaHomematePlatform);
};

class TuyaHomematePlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.accessories = [];

    if (!config || !config.devices || !Array.isArray(config.devices)) {
      this.log.warn('No devices configured.');
      return;
    }

    this.api.on('didFinishLaunching', () => {
      this.log.info('TuyaHomeMate platform launched.');
      this._initDevices();
    });
  }

  _initDevices() {
    for (const deviceConfig of this.config.devices) {
      if (!deviceConfig.id || !deviceConfig.key) {
        this.log.warn(`Device "${deviceConfig.name}" is missing id or key. Skipping.`);
        continue;
      }

      const fullConfig = {
        ...deviceConfig,
        version: '3.3',
        lights: HOMEMATE_LIGHTS,
        fan: HOMEMATE_FAN,
      };

      const acc = new HomeMate3Plus1Accessory(this.log, fullConfig, this.api);
      this.accessories.push(acc);
      this.api.publishExternalAccessories(PLUGIN_NAME, [acc.accessory]);
    }
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}
