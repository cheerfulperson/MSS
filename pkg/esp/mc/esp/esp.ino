#include <ESP8266WiFi.h>
#include <DNSServer.h>

#include "Handlers.h"
#include "StaticFiles.h"
#include "Storage.h"

#define STASSID "My Esp"

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;
Handlers handler;
Storage storage;

void startPoint()
{
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(STASSID);
  // modify TTL associated  with the domain name (in seconds)
  // default is 60 seconds`
  dnsServer.setTTL(300);
  // set which return code will be used for all other domains (e.g. sending
  // ServerFailure instead of NonExistentDomain will reduce number of queries
  // sent by clients)
  // default is DNSReplyCode::NonExistentDomain
  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);

  // start DNS server for a specific domain name
  dnsServer.start(DNS_PORT, "www.sha.com", apIP);
}

bool checkUntilConnected()
{
  // Will try for about 10 seconds (5x 500ms)
  int tryDelay = 500;
  int numberOfTries = 5;

  // Wait for the WiFi event
  while (true)
  {

    switch (WiFi.status())
    {
    case WL_CONNECT_FAILED:
      return false;
      break;
    case WL_CONNECTED:
      digitalWrite(LED_BUILTIN, HIGH);
      return true;
      break;
    case WL_NO_SSID_AVAIL:
    case WL_CONNECTION_LOST:
    case WL_SCAN_COMPLETED:
    case WL_DISCONNECTED:
    default:
      break;
    }
    delay(tryDelay);

    if (numberOfTries <= 0)
    {
      // Use disconnect function to force stop trying to connect
      WiFi.disconnect();
      return false;
    }
    else
    {
      numberOfTries--;
    }
  }
}

void handleConnect(Config config, TInfoCallback cb)
{
  if (config.password != NULL || config.ssid != NULL)
  {
    WiFi.begin(config.ssid, config.password);
    bool isConnected = checkUntilConnected();
    if (!isConnected)
    {
      startPoint();
    }
    else
    {
      cb(WebServerStatus::OK);
      return;
    }
  }
  cb(WebServerStatus::ERROR);
}

void setup()
{
  Config config = storage.getProperties();
  pinMode(LED_BUILTIN, OUTPUT);
  WiFi.mode(WIFI_STA);

  if (config.password != NULL || config.ssid != NULL)
  {
    WiFi.begin(config.ssid, config.password);
    bool isConnected = checkUntilConnected();
    if (!isConnected)
    {
      startPoint();
    }
  }
  else
  {
    startPoint();
  }

  handler.init();
  handler.handleApiPostConfig(handleConnect);
}

void loop()
{
  dnsServer.processNextRequest();
  handler.handleClient();
}
