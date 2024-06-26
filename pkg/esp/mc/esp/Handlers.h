
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <FS.h>
#include <FSImpl.h>
#include <LittleFS.h>
#include <functional>
#include <string.h>

#include "StaticFiles.h"
#include "Storage.h"
#include "WiFiUtils.h"
#include "AppSensors.h"
#include "Mqtt.h"

#ifndef HANDLERS_H
#define HANDLERS_H

enum class WebServerStatus : char
{
  OK = 'o',
  ERROR = 'E'
};

struct TNetwork
{
  char* ssid;
  int32_t rssi;
  uint8_t encryptionType;
  uint8_t* bssid;
  int32_t channel;
  bool hidden;
};

typedef std::function<void(WebServerStatus)> TInfoCallback;

class Handlers
{

public:
  typedef std::function<void(Config, TInfoCallback)> TCallback;

  void init();
  void handleClient();
  // private:
  //   void handleMainPage();
  //   void handleConnectJs();
};

#endif
