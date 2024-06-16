#include <Servo.h>
#include <ArduinoJson.h>

#ifndef APP_DEVICES_H
#define APP_DEVICES_H

struct AllDevicesData {
    float waterLevel;
    bool plug1;
    bool audio;
    bool motor;
    bool light1;
    bool light2;
    bool light3;
    bool light4;
    bool light5;
    bool light6;
    bool light7;
};

class AppDevices
{
public:
    void init();
    AllDevicesData getAllDevicesData();
    void changeDeviceStateByKey(String key, bool value);
};

#endif