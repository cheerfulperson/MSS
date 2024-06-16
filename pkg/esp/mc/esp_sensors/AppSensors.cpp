#include "AppSensors.h"

#define GAS_PIN A0
#define MAGNETIC_CONTACT_PIN1 D3
#define MAGNETIC_CONTACT_PIN2 D4
#define MOTION_SENSOR_PIN  D8

OneWire oneWire(D6);
DallasTemperature tempSensor(&oneWire);
DHT dht(D7, DHT11);
Adafruit_AHTX0 aht20;
Adafruit_BMP085 bmp;

int motion_state  = LOW; // current  state of motion sensor's pin
int prev_motion_state = LOW; // previous state of motion sensor's pin

void AppSensors::init()
{
  // Start up the library
  pinMode(MAGNETIC_CONTACT_PIN1, INPUT_PULLUP);
  pinMode(MAGNETIC_CONTACT_PIN2, INPUT_PULLUP);
  pinMode(MOTION_SENSOR_PIN, INPUT);
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
  unsigned int sensorValue = analogRead(sensorPin);  // Read the analog value from sensor
  float outputValue = map(sensorValue, 0, 1023, 0, 255); // map the 10-bit data to 8-bit data
  return outputValue;
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

AllSensorsData AppSensors::getAllSensorsData() {
  AllSensorsData result;
  result.temperature1 = getTemperature();
  result.temperature2 = getDHTTemperature();
  result.temperature3 = getAHT20Data().temperature;
  result.temperature4 = getBMPData().temperature;
  result.gas = getCOGassPPM();
  result.humidity1 = getHumidity();
  result.humidity2 = getAHT20Data().humidity;
  result.pressure = getBMPData().pressure;
  result.waterLevel = 0;
  result.motion = prev_motion_state == LOW && motion_state == HIGH ? true : false;
  result.magneticContact1 = digitalRead(MAGNETIC_CONTACT_PIN1) == LOW;
  result.magneticContact2 = digitalRead(MAGNETIC_CONTACT_PIN2) == LOW;
  return result;
}
