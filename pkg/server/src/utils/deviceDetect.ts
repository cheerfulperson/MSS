import { DeviceType } from '@prisma/client';

export const getDeviceType = (key: string) => {
  if (key.includes('humidity')) {
    return DeviceType.HUMIDITY_SENSOR;
  }
  if (key.includes('temper')) {
    return DeviceType.THERMOSTAT;
  }
  if (key.includes('motion')) {
    return DeviceType.MOTION_SENSOR;
  }
  if (key.includes('gas')) {
    return DeviceType.GAS_DETECTOR;
  }
  if (key.includes('water')) {
    return DeviceType.WATER_LEAK_DETECTOR;
  }
  if (key.includes('magnetic')) {
    return DeviceType.MAGNETIC_CONTACT_SENSOR;
  }
  if (key.includes('light')) {
    return DeviceType.LIGHT_SWITCH;
  }
  if (key.includes('motor')) {
    return DeviceType.SWITCH;
  }
  if (key.includes('plug')) {
    return DeviceType.SMART_PLUG;
  }
  return DeviceType.MULTI_DEVICE;
};

export const getIcon = (key: string) => {
  if (key.includes('humidity')) {
    return 'ThermometerSun';
  }
  if (key.includes('temper')) {
    return 'ThermometerHalf';
  }
  if (key.includes('motion')) {
    return 'Vignette';
  }
  if (key.includes('gas')) {
    return 'RecordCircle';
  }
  if (key.includes('water')) {
    return 'Moisture';
  }
  if (key.includes('magnetic')) {
    return 'ViewStacked';
  }
  if (key.includes('light')) {
    return 'Lightbulb';
  }
  if (key.includes('motor')) {
    return 'OpticalAudio';
  }
  if (key.includes('plug')) {
    return 'Plug';
  }
  return 'Hdd';
};
