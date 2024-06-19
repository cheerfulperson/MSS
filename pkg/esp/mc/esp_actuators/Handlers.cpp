#include "Handlers.h"

StaticFiles staticFiles;
ESP8266WebServer webServer(80);
Storage appStorage;
DynamicJsonDocument JSONDoc(1024);
WiFiUtils wifiUtils;
AppDevices sensors;
Mqtt mqtt;

char* enryptionType(int i)
{
  return (char*)"WPA2";
}

void handleMainPage()
{
  digitalWrite(LED_BUILTIN, HIGH);
  webServer.send(200, "text/html", staticFiles.getConnectFIle("html"));
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
}

void handleConnectJs()
{
  webServer.sendHeader("Cache-Control", "no-cache");
  webServer.send(200, "text/javascript; charset=utf-8", staticFiles.getConnectFIle("js"));
}

void handleApiGetNetworks()
{
  String ssid;
  int32_t rssi;
  uint8_t encryptionType;
  uint8_t* bssid;
  int32_t channel;
  bool hidden;

  String json;
  int n = WiFi.scanNetworks(false, true);

  if (n == 0)
  {
    webServer.send(200, "application/json", "{\"error\":\"not found\"}");
    return;
  }
  DynamicJsonDocument doc(2024);
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
  JSONDoc["homeSlug"] = config.homeSlug;
  serializeJson(JSONDoc, json);
  webServer.send(200, "application/json", json);
}

void handleUpdateSlug()
{
  if (webServer.hasArg("plain") == false)
  {
    webServer.send(400, "application/json", "{\"error\":\"Body not received\"}");
    return;
  }
  String json = webServer.arg("plain");
  DynamicJsonDocument doc(512);
  deserializeJson(doc, json);
  Config config = appStorage.getProperties();
  int homeSlugLength = strlen(doc["slug"] | "") + 1;
  config.homeSlug = (char*)malloc(homeSlugLength);
  strlcpy(config.homeSlug, doc["slug"] | "", homeSlugLength);
  appStorage.overwriteProperties(config);
  delay(500);
  mqtt.init();
  webServer.send(200, "application/json", "{\"status\":\"ok\"}");
}

void handleApiPostConfig()
{
  webServer.on("/api/config", HTTP_POST, []()
    {
      if (webServer.hasArg("plain") == false)
      {
        webServer.send(400, "application/json", "{\"error\":\"Body not received\"}");
        return;
      }
      String json = webServer.arg("plain");
      Config config;
      DynamicJsonDocument doc(512);
      deserializeJson(doc, json);
      int passswordLength = strlen(doc["password"] | "") + 1;
      int ssidLength = strlen(doc["ssid"] | "") + 1;
      if (ssidLength < 2 || passswordLength < 4) {
        webServer.send(400, "application/json", "{\"error\":\"Bad password or ssid\"}");
        return;
      }
      config.password = (char*)malloc(passswordLength);
      config.ssid = (char*)malloc(ssidLength);
      strlcpy(config.password, doc["password"] | "", passswordLength);
      strlcpy(config.ssid, doc["ssid"] | "", ssidLength);
      appStorage.overwriteProperties(config);

      bool isConnected = wifiUtils.waitForConnect(config);
      if (isConnected)
      {
        Serial.println("Connected");
        String data = "{\"status\": \"ok\",";
        data += "\"ip\": \"";
        data += WiFi.localIP().toString();
        data += "\"}";
        Serial.println(WiFi.localIP().toString());
        webServer.send(200, "application/json", data);
        // Make sure data was send
        delay(1000);
        WiFi.mode(WIFI_STA);
        return;
      }
      Serial.println("Bad request");
      webServer.send(400, "application/json", "{\"error\":\"Bad request\"}");
    });
}

void Handlers::handleClient()
{
  webServer.handleClient();
  mqtt.checkingToPublish();
}

void Handlers::init()
{
  appStorage.init();
  sensors.init();
  mqtt.init();
  handleApiPostConfig();
  webServer.on("/api/config/home", HTTP_POST, handleUpdateSlug);
  webServer.on("/api/config", HTTP_GET, handleApiConfig);
  // webServer.on("/api/sensors", HTTP_GET, handleApiGetSensors);
  webServer.on("/api/networks", HTTP_GET, handleApiGetNetworks);

  // Static
  webServer.on("/", HTTP_GET, handleMainPage);
  webServer.on("/index.js", HTTP_GET, handleConnectJs);

  webServer.onNotFound(handleMainPage);
  webServer.begin();
}
