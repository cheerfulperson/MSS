#include "Mqtt.h"
#include "BlockNot.h"

// MQTT Broker settings
const char *mqtt_broker = "192.168.0.102"; // EMQX broker endpoint
const char *mqtt_topic = "sensors/data";   // MQTT topic
const char *mqtt_username = "sensors";     // MQTT username for authentication
const char *mqtt_password = "public";      // MQTT password for authentication
const int mqtt_port = 1883;                // MQTT port (TCP)
const int push_interval =
    20000; // Interval in milliseconds to push data to MQTT broker

BlockNot timer(push_interval);
BlockNot realTimer(200);
WiFiClient espClient;
PubSubClient mqtt_client(espClient);
Storage mqttStorage;
AppSensors mqttSensors;
DynamicJsonDocument doc(2048);

String client_id;
int triesToReconnect = 3;
bool isServerStarted = false;
AllSensorsData devicesDataMqtt = {0};
bool magneticContact1 = false;
bool magneticContact2 = false;
bool motion = false;
char *json;

void mqttCallback(char *topic, byte *payload, unsigned int length) {}

char *prepareDeviceData(AllSensorsData data, bool ignoreNUll = false) {
  doc["motion"] = data.motion;
  doc["magneticContact1"] = data.magneticContact1;
  doc["magneticContact2"] = data.magneticContact2;

  String json;
  serializeJson(doc, json);
  delay(10);
  int length = strlen(json.c_str()) + 4;
  char *result = (char *)malloc(length);
  strlcpy(result, json.c_str(), length);
  doc.clear();
  return result;
}

char *prepareData(AllSensorsData data, bool ignoreNUll = false) {
  if (data.temperature1 != 0 || ignoreNUll) {
    doc["temperature1"] = data.temperature1;
  }
  if (data.temperature2 != 0 || ignoreNUll) {
    doc["temperature2"] = data.temperature2;
  }
  if (data.temperature3 != 0 || ignoreNUll) {
    doc["temperature3"] = data.temperature3;
  }
  if (data.temperature4 != 0 || ignoreNUll) {
    doc["temperature4"] = data.temperature4;
  }
  if (data.gas != 0 || ignoreNUll) {
    doc["gas"] = data.gas;
  }
  if (data.humidity1 != 0 || ignoreNUll) {
    doc["humidity1"] = data.humidity1;
  }
  if (data.humidity2 != 0 || ignoreNUll) {
    doc["humidity2"] = data.humidity2;
  }
  if (data.pressure != 0 || ignoreNUll) {
    doc["pressure"] = data.pressure;
  }
  if (data.waterLevel != 0 || ignoreNUll) {
    doc["waterLevel"] = data.waterLevel;
  }
  if (ignoreNUll == true) {
    doc["motion"] = data.motion;
    doc["magneticContact1"] = data.magneticContact1;
    doc["magneticContact2"] = data.magneticContact2;
  }

  String json;
  serializeJson(doc, json);
  delay(10);
  int length = strlen(json.c_str()) + 4;
  char *result = (char *)malloc(length);
  strlcpy(result, json.c_str(), length);
  doc.clear();
  return result;
}

void Mqtt::publishData(AllSensorsData data, bool isDevice = false) {
  json = isDevice ? prepareDeviceData(data) : prepareData(data);
  int length = strlen(json);
  if (length > 10) {
    mqtt_client.publish(mqtt_topic, json, length);
  }
}

void Mqtt::init() {
  int tryDelay = 1000;
  int numberOfTries = 3;
  struct AllSensorsData data = mqttSensors.getAllSensorsData(true);
  Config globalConfig = mqttStorage.getProperties();
  json = prepareData(data, true);

  if (isServerStarted == false) {
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setCallback(mqttCallback);
    isServerStarted = true;
  }

  if (strlen(globalConfig.homeSlug) < 3 || globalConfig.homeSlug == "" ||
      globalConfig.homeSlug == NULL) {
    return;
  }

  while (!mqtt_client.connected()) {
    client_id = String("esp8266-") + globalConfig.homeSlug + String("-") +
                String(WiFi.macAddress());
    if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      // Publish message upon successful connection to sent schema to the broker
      int length = strlen(json);
      Serial.println("subscribed mqtt");
      if (length > 10) {
        mqtt_client.publish(mqtt_topic, json, length);
      }
      return;
    } else {
      if (numberOfTries < 0) {
        return;
      }
      numberOfTries--;
      delay(tryDelay);
    }
  }
}
void Mqtt::checkingToPublish() {
  mqtt_client.loop();
  if (mqtt_client.connected()) {
    if (timer.triggered()) {
      publishData(mqttSensors.getAllSensorsData(false));
    }
    if (realTimer.triggered()) {
      devicesDataMqtt = mqttSensors.getDevicesData();

      if (magneticContact1 != devicesDataMqtt.magneticContact1) {
        magneticContact1 = devicesDataMqtt.magneticContact1;
        publishData(devicesDataMqtt, true);
      }
      if (magneticContact2 != devicesDataMqtt.magneticContact2) {
        magneticContact2 = devicesDataMqtt.magneticContact2;
        publishData(devicesDataMqtt, true);
      }
      if (motion != devicesDataMqtt.motion) {
        motion = devicesDataMqtt.motion;
        publishData(devicesDataMqtt, true);
      }
    }
  } else {
      if (triesToReconnect < 0) {
        return;
      }
      triesToReconnect--;
      if (mqtt_client.connect(client_id.c_str())) {
        mqtt_client.subscribe(mqtt_topic);
        triesToReconnect = 3;
        Serial.println("subscribed mqtt");
        return;
      }
      delay(2000);
  }
}
