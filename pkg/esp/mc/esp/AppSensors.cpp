#include "AppSensors.h"

OneWire oneWire(D6);
DallasTemperature tempSensor(&oneWire);
MQ7 mq7(A0, 5.0);
DHT dht(D7, DHT11);
Adafruit_AHTX0 aht20;
Adafruit_BMP085 bmp;

void AppSensors::init()
{
  // Start up the library
  dht.begin();
  tempSensor.begin();
  Wire.begin();
  aht20.begin();
  bmp.begin();
}

float AppSensors::getTemperature(void)
{
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);

  return tempC != DEVICE_DISCONNECTED_C ? tempC : 0;
}

float AppSensors::getDHTTemperature(void)
{
  return dht.readTemperature();
}

float AppSensors::getCOGassPPM(void)
{
  return mq7.getPPM();
}

float AppSensors::getHumidity() {
  return dht.readHumidity();
}

AHT20Data AppSensors::getAHT20Data() {
  AHT20Data result;
  sensors_event_t humidity, temp;
  aht20.getEvent(&humidity, &temp);
  result.temperature = temp.temperature;
  result.humidity = humidity.relative_humidity;
  return result;
}

String AppSensors::getAHT20DataJson() {
  AHT20Data data = getAHT20Data();
  String json;
  DynamicJsonDocument doc(1024);
  doc["temperature"] = data.temperature;
  doc["humidity"] = data.humidity;
  serializeJson(doc, json);
  return json;
}

BMPData AppSensors::getBMPData() {
  BMPData result;
  result.temperature = bmp.readTemperature();
  result.pressure = bmp.readPressure();
  result.seaLevelMeters = bmp.readAltitude();
  return result;
}

String AppSensors::getBMPDataJson() {
  BMPData data = getBMPData();
  String json;
  DynamicJsonDocument doc(1024);
  doc["temperature"] = data.temperature;
  doc["pressure"] = data.pressure;
  doc["seaLevelMeters"] = data.seaLevelMeters;
  serializeJson(doc, json);
  return json;
}

float AppSensors::getAverageTemperature()
{
  float t, i = 0;
  float temp = getTemperature();
  float dhtTemp = getDHTTemperature();
  float ahtTemp = getAHT20Data().temperature;
  float bmpTemp = getBMPData().temperature;

  if (temp != 0) {
    i += 1;
    t += temp;
  }
  if (dhtTemp != 0) {
    i += 1;
    t += dhtTemp;
  }
  if (ahtTemp != 0) {
    i += 1;
    t += ahtTemp;
  }
  if (bmpTemp != 0) {
    i += 1;
    t += bmpTemp;
  }
  return (t) / i;
}

float AppSensors::getAverageHumidity()
{
  float h, i = 0;
  float hum = getHumidity();
  float ahtHum = getAHT20Data().humidity;

  if (hum != 0) {
    i += 1;
    h += hum;
  }
  if (ahtHum != 0) {
    i += 1;
    h += ahtHum;
  }
  return (h) / i;
}
