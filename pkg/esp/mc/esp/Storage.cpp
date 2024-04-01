#include "Storage.h"

DynamicJsonDocument JSONData(2048);

const char* STORAGE_PATH = "/storage.txt";
bool isWrited = false;

void writeFile(const char* path, String message);
void writeFile(const char* path, const char* message);

void writeFile(const char* path, String message) {
  File file = LittleFS.open(path, "w+");
  if (!file) {
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  }
  else {
    Serial.println("Write failed");
  }
  delay(2000);  // Make sure the CREATE and LASTWRITE times are different
  file.close();
}

void writeFile(const char* path, const char* message) {
  File file = LittleFS.open(path, "w+");
  if (!file) {
    return;
  }
  if (file.print(message)) {
    Serial.println("File written");
  }
  else {
    Serial.println("Write failed");
  }
  delay(2000);  // Make sure the CREATE and LASTWRITE times are different
  file.close();
}

String readFile(const char* path) {
  String json = "";
  File file = LittleFS.open(path, "r+");
  if (!file) {
    return "";
  }

  while (file.available()) { json += char(file.read()); }
  file.close();

  return json;
}

bool Storage::checkFile(const char* fileN)
{
  Dir root = LittleFS.openDir("/");

  while (root.next()) {
    File file = root.openFile("r");

    if (root.fileName() == fileN) {
      file.close();
      return true;
    }
    Serial.println(root.fileName());
    Serial.println(fileN);
    file.close();
  }
  return false;
}

String Storage::hasConfigFile()
{
  String json;
  bool isExist = checkFile("storage.txt");

  if (!isWrited) {
    isWrited = true;
    JsonDocument JSONData;
    JSONData["password"] = "passsword";
    JSONData["ssid"] = "ssid";
    JSONData["serverUrl"] = "serverUrl";
    serializeJson(JSONData, json);
    writeFile(STORAGE_PATH, json);
    return json;
  }
  if (isExist) {
    String data = readFile(STORAGE_PATH);
    // deserializeJson(JSONData, data);
    // int ssidLength = strlen(JSONData["ssid"] | "") + 4;
    // data = (char*)malloc(ssidLength);
    // strlcpy(data, JSONData["ssid"] | "", ssidLength);
    return data;
  }
  return "not found";
}

Config Storage::getProperties()
{
  Config config;
  String data = readFile(STORAGE_PATH);
  deserializeJson(JSONData, data);
  int passswordLength = strlen(JSONData["password"] | "") + 4;
  int ssidLength = strlen(JSONData["ssid"] | "") + 4;
  int serverUrlLength = strlen(JSONData["serverUrl"] | "") + 4;
  config.password = (char*)malloc(passswordLength);
  config.ssid = (char*)malloc(ssidLength);
  config.serverUrl = (char*)malloc(serverUrlLength);
  strlcpy(config.serverUrl, JSONData["serverUrl"] | "", serverUrlLength);
  strlcpy(config.password, JSONData["password"] | "", passswordLength);
  strlcpy(config.ssid, JSONData["ssid"] | "", ssidLength);

  return config;
}

void Storage::overwriteProperties(Config data)
{
  String json;
  JSONData["password"] = data.password;
  JSONData["ssid"] = data.ssid;
  JSONData["serverUrl"] = data.serverUrl;

  serializeJson(JSONData, json);
  writeFile(STORAGE_PATH, json);
}

void Storage::init()
{
  if (!LittleFS.begin()) {
    Serial.println("LittleFS mount failed");
    return;
  }
}