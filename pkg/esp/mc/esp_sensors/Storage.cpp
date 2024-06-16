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

Config Storage::getProperties()
{
  Config config;
  String data = readFile(STORAGE_PATH);
  deserializeJson(JSONData, data);
  int passswordLength = strlen(JSONData["password"] | "") + 4;
  int ssidLength = strlen(JSONData["ssid"] | "") + 4;
  int serverUrlLength = strlen(JSONData["homeSlug"] | "") + 4;
  config.password = (char*)malloc(passswordLength);
  config.ssid = (char*)malloc(ssidLength);
  config.homeSlug = (char*)malloc(serverUrlLength);
  strlcpy(config.homeSlug, JSONData["homeSlug"] | "", serverUrlLength);
  strlcpy(config.password, JSONData["password"] | "", passswordLength);
  strlcpy(config.ssid, JSONData["ssid"] | "", ssidLength);

  return config;
}

void Storage::overwriteProperties(Config data)
{
  Config config = getProperties();
  String json;

  JSONData["password"] = data.password != NULL && data.password != "" ? data.password : config.password;
  JSONData["ssid"] = data.ssid != NULL && data.ssid != "" ? data.ssid : config.ssid;
  JSONData["homeSlug"] = data.homeSlug != NULL && data.homeSlug != "" ? data.homeSlug : config.homeSlug;

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