#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "AppDevices.h"
#include "Storage.h"
#include "Neotimer.h"

#ifndef MQTT_H
#define MQTT_H

class Mqtt
{
public:
    void init();
    void publishData();
    void checkingToPublish();
};

#endif
