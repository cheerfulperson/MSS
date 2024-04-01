#include <ESP8266WiFi.h>
#include <DNSServer.h>

#include "Handlers.h"
#include "StaticFiles.h"
#include "Storage.h"
#include "WiFiUtils.h"

WiFiUtils wifiTools;
Handlers handler;
Storage storage;

void setup() {
  Serial.begin(115200);
  storage.init();
  Config config = storage.getProperties();
  // Start up the library
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(0, OUTPUT);

  bool isConnected = wifiTools.waitForConnect(config);
  if (!isConnected) {
    // Set in station mode
    WiFi.mode(WIFI_AP_STA);
    wifiTools.startPoint();
  } else {
  }
  Serial.println("Connected: " + isConnected);
  handler.init();
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  wifiTools.nextRequest();
  handler.handleClient();
}
