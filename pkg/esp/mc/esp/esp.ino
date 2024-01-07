#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>

#include "StaticFiles.h"
// #include "WM.h"

#define STASSID "My Esp"

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;
ESP8266WebServer webServer(80);
StaticFiles staticFiles;

// WM my_wifi;

void handleMainPage()
{
  String data = staticFiles.getConnectFIle("html");
  digitalWrite(LED_BUILTIN, HIGH);

  webServer.send(200, "text/html; charset=utf-8", data);
  digitalWrite(LED_BUILTIN, 0);
}

void getConnectJs()
{
  String data = staticFiles.getConnectFIle("js");
  digitalWrite(LED_BUILTIN, HIGH);

  webServer.send(200, "text/plain", data);
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
  staticFiles.readConnectFiles();
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
  dnsServer.start(DNS_PORT, "www.esp.com", apIP);

  webServer.on("/", handleMainPage);
  // webServer.on("/index.js", getConnectJs);
  // simple HTTP server to see that DNS server is working
  webServer.onNotFound(handleNotFound);
  webServer.begin();
}

void loop()
{
  dnsServer.processNextRequest();
  webServer.handleClient();
}
