#include "AppSensors.h"

#define GAS_PIN A0
#define MAGNETIC_CONTACT_PIN1 D3
#define MAGNETIC_CONTACT_PIN2 D4
#define MOTION_SENSOR_PIN D5

OneWire oneWire(D6);
DallasTemperature tempSensor(&oneWire);
DHT dht(D7, DHT11);
Adafruit_AHTX0 aht20;
Adafruit_BMP085 bmp;

int motion_state = LOW;      // current  state of motion sensor's pin
int prev_motion_state = LOW; // previous state of motion sensor's pin
bool isAht20Connected = false;
bool isBmpConnected = false;
float KPressure = 0.00750063755419211;
AllSensorsData sensorsData = {0};
AllSensorsData devicesData = {0};

void AppSensors::init() {
  // Start up the library
  pinMode(MAGNETIC_CONTACT_PIN1, INPUT_PULLUP);
  pinMode(MAGNETIC_CONTACT_PIN2, INPUT_PULLUP);
  pinMode(MOTION_SENSOR_PIN, INPUT);
  Wire.begin();
  dht.begin();
  tempSensor.begin();
  isAht20Connected = aht20.begin();
  isBmpConnected = bmp.begin();
}

float AppSensors::getTemperature(void) {
  tempSensor.requestTemperatures();
  float tempC = tempSensor.getTempCByIndex(0);

  return tempC != DEVICE_DISCONNECTED_C ? tempC : 0;
}

float AppSensors::getDHTTemperature(void) {
  return dht.readTemperature();
}

float AppSensors::getCOGassPPM(void) {
  unsigned int sensorValue =
      analogRead(GAS_PIN); // Read the analog value from sensor
  float outputValue =
      map(sensorValue, 0, 1023, 0, 255); // map the 10-bit data to 8-bit data
  return outputValue;
}

float AppSensors::getHumidity() { return dht.readHumidity(); }

AHT20Data AppSensors::getAHT20Data() {
  AHT20Data result;
  if (!isAht20Connected) {
    isAht20Connected = aht20.begin();
    return result;
  }
  sensors_event_t humidity, temp;
  aht20.getEvent(&humidity, &temp);
  result.temperature = temp.temperature;
  result.humidity = humidity.relative_humidity;
  return result;
}

String AppSensors::getAHT20DataJson() {
  AHT20Data data = getAHT20Data();
  String json;
  DynamicJsonDocument doc(256);
  doc["temperature"] = data.temperature;
  doc["humidity"] = data.humidity;
  serializeJson(doc, json);
  doc.clear();
  return json;
}

BMPData AppSensors::getBMPData() {
  BMPData result;
  if (!isBmpConnected) {
    isBmpConnected = bmp.begin();
    return result;
  }
  result.temperature = bmp.readTemperature();
  result.pressure = bmp.readSealevelPressure(281) * KPressure;
  result.seaLevelMeters = bmp.readAltitude();
  return result;
}

String AppSensors::getBMPDataJson() {
  BMPData data = getBMPData();
  String json;
  DynamicJsonDocument doc(256);
  doc["temperature"] = data.temperature;
  doc["pressure"] = data.pressure;
  doc["seaLevelMeters"] = data.seaLevelMeters;
  serializeJson(doc, json);
  doc.clear();
  return json;
}

AllSensorsData AppSensors::getAllSensorsData(bool includeDevices) {
  sensorsData.temperature1 = getTemperature();
  sensorsData.temperature2 = getDHTTemperature();
  sensorsData.temperature3 = getAHT20Data().temperature;
  sensorsData.temperature4 = getBMPData().temperature;
  sensorsData.gas = getCOGassPPM();
  sensorsData.humidity1 = getHumidity();
  sensorsData.humidity2 = getAHT20Data().humidity;
  sensorsData.pressure = getBMPData().pressure;

  if (includeDevices == true) {
    prev_motion_state = motion_state; // store old state
    motion_state = digitalRead(MOTION_SENSOR_PIN);
    sensorsData.motion = motion_state;
    sensorsData.magneticContact1 = digitalRead(MAGNETIC_CONTACT_PIN1) != LOW;
    sensorsData.magneticContact2 = digitalRead(MAGNETIC_CONTACT_PIN2) != LOW;
  }
  return sensorsData;
}

AllSensorsData AppSensors::getDevicesData() {
  prev_motion_state = motion_state; // store old state
  motion_state = digitalRead(MOTION_SENSOR_PIN);
  devicesData.motion = motion_state;
  devicesData.magneticContact1 = digitalRead(MAGNETIC_CONTACT_PIN1) != LOW;
  devicesData.magneticContact2 = digitalRead(MAGNETIC_CONTACT_PIN2) != LOW;
  return devicesData;
}
