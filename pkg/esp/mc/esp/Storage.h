#include <ArduinoJson.h>
#include <FS.h>
#include <LittleFS.h>
#include <string.h>

#ifndef STORAGE_H
#define STORAGE_H

struct Config
{
  char* ssid;
  char* serverUrl;
  char* password;
};

class Storage
{
public:
  struct Config getProperties();
  void overwriteProperties(Config data);
  String hasConfigFile();
  void init();

protected:
  bool checkFile(const char* fileName);
};

#endif
