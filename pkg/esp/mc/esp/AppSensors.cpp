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
