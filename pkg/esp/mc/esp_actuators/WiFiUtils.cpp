#include "WiFiUtils.h"

#define STASSID "My Esp"
#define MOBILE_SSID "Starlink"
#define PASSWORD "egor1234567"

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;

void WiFiUtils::startPoint()
{
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(STASSID);
  WiFi.mode(WIFI_AP_STA);
  // WiFi.softAPdisconnect
  // modify TTL associated  with the domain name (in seconds)
  // default is 60 seconds`
  dnsServer.setTTL(300);
  // set which return code will be used for all other domains (e.g. sending
  // ServerFailure instead of NonExistentDomain will reduce number of queries
  // sent by clients)
  // default is DNSReplyCode::NonExistentDomain
  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);

  // start DNS server for a specific domain name
  dnsServer.start(DNS_PORT, "www.ihome.com", apIP);
}

void WiFiUtils::nextRequest()
{
  dnsServer.processNextRequest();
}

bool WiFiUtils::checkUntilConnected()
{

  // Will try for about 10 seconds (5x 500ms)
  int tryDelay = 1000;
  int numberOfTries = 5;

  int status = WiFi.waitForConnectResult(numberOfTries * tryDelay);
  return status == WL_CONNECTED;
}

bool WiFiUtils::waitForConnect(Config config)
{
  WiFi.persistent(true);
  WiFi.setAutoConnect(true);
  if (config.password != NULL || config.ssid != NULL) {
    WiFi.begin(config.ssid, config.password);
    bool isConnected = checkUntilConnected();
    if (isConnected) {
      return true;
    }
  }
  WiFi.begin(MOBILE_SSID, PASSWORD);
  bool isConnected = checkUntilConnected();
  return isConnected;
}
