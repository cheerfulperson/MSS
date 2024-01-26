#include "Storage.h"

DynamicJsonDocument JSONData(1024);

const char *dirname = "/storage.txt";

bool Storage::checkFile(const char *fileName)
{
  File file = LittleFS.open(dirname, "r");
  if (!file)
  {
    return false;
  }
  file.close();
  return true;
}

char *Storage::hasConfigFile()
{
  char json[1024];
  File file = LittleFS.open(dirname, "w+");
  if (!file)
  {
    return "not found";
  }
  char *filePath = (char *)file.name();
  JSONData["password"] = "password";
  JSONData["ssid"] = "ssid";
  serializeJson(JSONData, json);
  file.print(json);
  delay(200);
  file.close();
  return filePath;
}

Config Storage::getProperties()
{
  Config config;
  char json[1024];
  bool isExist = checkFile(dirname);
  config.password = NULL;
  config.ssid = NULL;

  if (!isExist)
  {

    File file = LittleFS.open(dirname, "w");
    if (!file)
    {
      return config;
    }
    JSONData["password"] = config.password;
    JSONData["ssid"] = config.ssid;
    serializeJson(JSONData, json);
    file.print(json);
    delay(200);
    file.close();
    return config;
  }
  int i = 0;
  File file = LittleFS.open(dirname, "r");
  if (!file)
  {
    return config;
  }
  while (file.available())
  {
    json[i] = file.read();
    i++;
  }
  DynamicJsonDocument doc(2048);
  deserializeJson(doc, json);
  file.close();
  const char *password = doc["password"];
  const char *ssid = doc["ssid"];
  config.password = const_cast<char *>(password);
  config.ssid = const_cast<char *>(ssid);
  return config;
}

void Storage::overwriteProperties(Config data)
{
  struct Config config = data;
  char json[1024];
  File file = LittleFS.open(dirname, "w");
  if (!file)
  {
    return;
  }
  JSONData["password"] = config.password;
  JSONData["ssid"] = config.ssid;
  serializeJson(JSONData, json);
  file.print(json);
  delay(200);
  file.close();
}