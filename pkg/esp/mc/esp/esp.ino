#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>

#include "FileRader.h"
// #include "WM.h"

#define STASSID "My Esp"

const String domain = "www.esp.com";
const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 30);
DNSServer dnsServer;
ESP8266WebServer webServer(80);
// WM my_wifi;

char *connectHTML;
char *connectJS;

void handleMainPage()
{
  digitalWrite(LED_BUILTIN, HIGH);

  webServer.send(200, "text/plain", connectHTML);
    digitalWrite(LED_BUILTIN, 0);
}

void getConnectJs()
{
  digitalWrite(LED_BUILTIN, HIGH);

  webServer.send(200, "text/plain", connectJS);
    digitalWrite(LED_BUILTIN, 0);
}

void handleNotFound()
{
  digitalWrite(LED_BUILTIN, HIGH);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += webServer.uri();
  message += "\nMethod: ";
  message += (webServer.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += webServer.args();
  message += "\n";

  for (uint8_t i = 0; i < webServer.args(); i++)
  {
    message += " " + webServer.argName(i) + ": " + webServer.arg(i) + "\n";
  }

  webServer.send(404, "text/plain", message);
  digitalWrite(LED_BUILTIN, 0);
}

void setup()
{
  WiFi.mode(WIFI_STA);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(STASSID);
  connectHTML = readFile("ht");
  connectJS = readFile("js");
  Serial.println(connectHTML);
  pinMode(LED_BUILTIN, OUTPUT);
  // modify TTL associated  with the domain name (in seconds)
  // default is 60 seconds
  dnsServer.setTTL(300);
  // set which return code will be used for all other domains (e.g. sending
  // ServerFailure instead of NonExistentDomain will reduce number of queries
  // sent by clients)
  // default is DNSReplyCode::NonExistentDomain
  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);

  // start DNS server for a specific domain name
  dnsServer.start(DNS_PORT, domain, apIP);

  webServer.on("/", handleMainPage);
  webServer.on("/index.js", getConnectJs);
  // simple HTTP server to see that DNS server is working
  webServer.onNotFound(handleNotFound);
  webServer.begin();
}

void loop()
{
  dnsServer.processNextRequest();
  webServer.handleClient();
}
