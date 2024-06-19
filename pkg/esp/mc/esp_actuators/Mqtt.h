#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <BlockNot.h>
#include <WebSocketsClient.h>
#include "AppDevices.h"
#include "Storage.h"
#include <Hash.h>

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
