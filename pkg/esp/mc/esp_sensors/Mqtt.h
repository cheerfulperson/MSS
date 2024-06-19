#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <BlockNot.h>
#include "AppSensors.h"
#include "Storage.h"
#include <Hash.h>

#ifndef MQTT_H
#define MQTT_H

class Mqtt
{
public:
    void init();
    void publishData(AllSensorsData data, bool isDevice);
    void checkingToPublish();
};

#endif
