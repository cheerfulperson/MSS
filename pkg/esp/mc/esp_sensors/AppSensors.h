#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP085.h>

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

struct AllSensorsData {
    float temperature1;
    float temperature2;
    float temperature3;
    float temperature4;
    float gas;
    float humidity1;
    float humidity2;
    float pressure;
    float waterLevel;
    bool motion;
    bool magneticContact1;
    bool magneticContact2;
};

class AppSensors
{
public:
    void init();
    float getTemperature();
    float getDHTTemperature();
    float getCOGassPPM();
    float getHumidity();
    AllSensorsData getAllSensorsData(bool includeDevices = false);
    AllSensorsData getDevicesData();
    AHT20Data getAHT20Data();
    BMPData getBMPData();
    String getAHT20DataJson();
    String getBMPDataJson();
};

#endif