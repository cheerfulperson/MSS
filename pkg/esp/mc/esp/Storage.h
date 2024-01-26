#include <ArduinoJson.h>
#include <FS.h>
#include <LittleFS.h>

#ifndef STORAGE_H
#define STORAGE_H

struct Config
{
  char *ssid;
  char *password;
};

class Storage
{
public:
  struct Config getProperties();
  void overwriteProperties(Config data);
  char *hasConfigFile();

protected:
  bool checkFile(const char *fileName);
};

#endif
