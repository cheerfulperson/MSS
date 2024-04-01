#include <ESP8266WiFi.h>
#include <DNSServer.h>

#include "Storage.h"

#ifndef WIFIUTILS_H
#define WIFIUTILS_H

class WiFiUtils {
public:
    void startPoint();
    void nextRequest();
    bool checkUntilConnected();
    bool waitForConnect(Config config);
};

#endif
