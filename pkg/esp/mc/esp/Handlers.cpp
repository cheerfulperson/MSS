#include "Handlers.h"

StaticFiles staticFiles;
ESP8266WebServer webServer(80);
Storage appStorage;
DynamicJsonDocument JSONDoc(1024);

char *enryptionType(int i)
{
  return (char *)"WPA2";
}

void handleMainPage()
{
  String data = staticFiles.getConnectFIle("html");
  digitalWrite(LED_BUILTIN, HIGH);

  webServer.send(200, "text/html", data);
  digitalWrite(LED_BUILTIN, 0);
}

void handleConnectJs()
{
  String data = staticFiles.getConnectFIle("js");
  digitalWrite(LED_BUILTIN, HIGH);

  if (!data)
  {
    webServer.send(500);
  }
  webServer.sendHeader("Cache-Control", "no-cache");
  webServer.send(200, "text/javascript; charset=utf-8", data);
  digitalWrite(LED_BUILTIN, LOW);
}

void handleApiGetNetworks()
{
  String ssid;
  int32_t rssi;
  uint8_t encryptionType;
  uint8_t *bssid;
  int32_t channel;
  bool hidden;

  String json;
  int n = WiFi.scanNetworks(false, true);

  if (n == 0)
  {
    webServer.send(200, "application/json", "{\"error\":\"not found\"}");
    return;
  }
  JsonDocument doc;
  JsonArray array = doc.to<JsonArray>();
  for (int i = 0; i < n; ++i)
  {
    WiFi.getNetworkInfo(i, ssid, encryptionType, rssi, bssid, channel, hidden);
    String obj;
    JsonDocument net;
    net["channel"] = channel;
    net["encryptionType"] = encryptionType;
    net["hidden"] = hidden;
    net["id"] = i;
    net["rssi"] = rssi;
    net["ssid"] = ssid.c_str();
    serializeJson(net, obj);
    array.add(obj);
  }
  serializeJson(doc, json);
  webServer.send(200, "application/json", json);
}

void handleApiConfig()
{
  String json;
  Config config = appStorage.getProperties();
  JSONDoc["ssid"] = config.ssid;
  serializeJson(JSONDoc, json);
  webServer.send(200, "application/json", json);
}

void handleStatus(WebServerStatus status)
{
  if (status == WebServerStatus::OK)
  {
    webServer.send(200, "application/json", "{\"status\": \"ok\"}");
  }
  if (status == WebServerStatus::ERROR)
  {
    webServer.send(400, "application/json", "{\"error\":\"Bad request\"}");
  }
}

void Handlers::handleApiPostConfig(TCallback fn)
{
  webServer.on("/api/config", HTTP_POST, [&fn]()
               {
                 if (webServer.hasArg("plain") == false)
                 {
                   webServer.send(400, "application/json", "{\"error\":\"Body not received\"}");
                   return;
                 }
                 String json = webServer.arg("plain");
                 webServer.send(200, "application/json", json);
                 return;
                 // Config config;
                 // DynamicJsonDocument doc(2048);
                 // deserializeJson(doc, json);
                 // const char *password = doc["password"];
                 // const char *ssid = doc["ssid"];
                 // config.password = const_cast<char *>(password);
                 // config.ssid = const_cast<char *>(ssid);
                 // appStorage.overwriteProperties(config);
                 // fn(config, handleStatus);
               });
}

void Handlers::handleClient()
{
  webServer.handleClient();
}

void Handlers::init()
{
  staticFiles.readConnectFiles();

  webServer.on("/api/config", HTTP_GET, handleApiConfig);
  webServer.on("/api/networks", HTTP_GET, handleApiGetNetworks);
  webServer.on("/api/check/fs", HTTP_GET, []()
               {
        char *msg = appStorage.hasConfigFile();
        String data = "{\"exist\":" ;
        data +=msg;
        data += "}";
     webServer.send(200, "application/json", data); });

  // Static
  webServer.on("/", HTTP_GET, handleMainPage);
  webServer.on("/index.js", HTTP_GET, handleConnectJs);

  webServer.onNotFound(handleMainPage);
  webServer.begin();
}
