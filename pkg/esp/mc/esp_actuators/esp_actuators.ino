#include <ESP8266WiFi.h>
#include <DNSServer.h>

#include "Handlers.h"
#include "StaticFiles.h"
#include "Storage.h"
#include "WiFiUtils.h"

#define PLUG1_PIN D6

WiFiUtils wifiTools;
Handlers handler;
Storage storage;

void setup() {
  Serial.begin(115200);
  storage.init();
  Serial.print("Start");
  Config config = storage.getProperties();
  // Start up the library
  pinMode(LED_BUILTIN, OUTPUT);
  // setup plug
  pinMode(PLUG1_PIN, OUTPUT);
  digitalWrite(PLUG1_PIN, HIGH);

  bool isConnected = wifiTools.waitForConnect(config);
  if (!isConnected) {
    // Set in station mode
    wifiTools.startPoint();
  }
  handler.init();
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  wifiTools.nextRequest();
  handler.handleClient();
}
