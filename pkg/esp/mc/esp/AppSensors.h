#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP085.h>

#include "MQ7.h"

#ifndef APP_SENSORS_H
#define APP_SENSORS_H

struct AHT20Data {
    float temperature;
    float humidity;
};
struct BMPData {
    float temperature;
    float pressure;
    float seaLevelMeters;
};

class AppSensors
{
public:
    void init();
    float getTemperature();
    float getDHTTemperature();
    float getCOGassPPM();
    float getHumidity();
    AHT20Data getAHT20Data();
    BMPData getBMPData();
    String getAHT20DataJson();
    String getBMPDataJson();
};

#endif