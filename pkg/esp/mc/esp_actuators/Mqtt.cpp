#include "Mqtt.h"

// MQTT Broker settings
const char *mqtt_broker = "192.168.0.102";       // EMQX broker endpoint
const char *mqtt_topic = "actuators/data";       // MQTT topic
const char *mqtt_topic_cb = "clientDevicesData"; // MQTT topic
const char *mqtt_username = "sensors"; // MQTT username for authentication
const char *mqtt_password = "public";  // MQTT password for authentication
const int mqtt_port = 1883;            // MQTT port (TCP)
const int push_interval =
    20000; // Interval in milliseconds to push data to MQTT broker

BlockNot timer(push_interval);
BlockNot realTimer(200);
WiFiClient espClient;
PubSubClient mqtt_client(espClient);
Storage mqttStorage;
AppDevices mqttDevices;
DynamicJsonDocument doc(1024);
DynamicJsonDocument desDocs(1024);

int triesToReconnect = 3;
bool isServerStarted = false;
float waterLevel = 0;
char *json;
String client_id;
//  value: jsonParse[key].toString(),
//  treatLevel: TreatLevel.INFO,
//   Device: {
//   id: device.id,
//},
// DeviceValueSetup: {
//   key,
// },

void mqttCallback(char *topic, byte *p, unsigned int length) {

  Serial.println(topic);
  const char *payload = reinterpret_cast<const char *>(p);

  if (strcmp(topic, mqtt_topic_cb) == 0) {
    deserializeJson(desDocs, payload, length + 4);
    String value = desDocs["value"];
    String key = desDocs["DeviceValueSetup"]["key"];
    mqttDevices.changeDeviceStateByKey(key, value == "true" ? true : false);
    doc.clear();
  }
}

char *prepareData(AllDevicesData data) {
  doc["waterLevel"] = data.waterLevel;
  doc["plug1"] = data.plug1;
  doc["audio"] = data.audio;
  doc["motor"] = data.motor;
  doc["light1"] = data.light1;
  doc["light2"] = data.light2;
  doc["light3"] = data.light3;
  doc["light4"] = data.light4;
  doc["light5"] = data.light5;
  doc["light6"] = data.light6;
  doc["light7"] = data.light7;
  String json;
  serializeJson(doc, json);
  delay(10);
  int length = strlen(json.c_str()) + 4;
  char *result = (char *)malloc(length);
  strlcpy(result, json.c_str(), length);
  doc.clear();
  return result;
}

void Mqtt::publishData() {
  AllDevicesData data = mqttDevices.getAllDevicesData();

  json = prepareData(data);
  mqtt_client.publish(mqtt_topic, json);
}

void Mqtt::init() {
  int tryDelay = 1000;
  int numberOfTries = 3;
  AllDevicesData data = mqttDevices.getAllDevicesData();
  Config globalConfig = mqttStorage.getProperties();
  json = prepareData(data);

  if (isServerStarted == false) {
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    isServerStarted = true;
  }
  mqtt_client.setCallback(mqttCallback);
  Serial.println("globalConfig.homeSlug");
  Serial.println(globalConfig.homeSlug);
  if (strlen(globalConfig.homeSlug) < 3 || globalConfig.homeSlug == "" ||
      globalConfig.homeSlug == NULL) {
    return;
  }

  while (!mqtt_client.connected()) {
    client_id = String("esp8266-") + globalConfig.homeSlug + String("-") +
                String(WiFi.macAddress());
    if (mqtt_client.connect(client_id.c_str())) {
      mqtt_client.subscribe(mqtt_topic_cb);
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
      publishData();
    }
    if (realTimer.triggered()) {
      float newWaterLevel = mqttDevices.getAllDevicesData().waterLevel;
      float diff = abs(waterLevel - newWaterLevel);
      if (diff > 40) {
        doc["waterLevel"] = newWaterLevel;
        waterLevel = newWaterLevel;
        String json;
        serializeJson(doc, json);
        delay(10);
        int length = strlen(json.c_str()) + 4;
        char *result = (char *)malloc(length);
        strlcpy(result, json.c_str(), length);
        doc.clear();
        mqtt_client.publish(mqtt_topic, result);
      }
    }
  } else {
    if (triesToReconnect < 0) {
      return;
    }
    triesToReconnect--;
    if (mqtt_client.connect(client_id.c_str())) {
      mqtt_client.subscribe(mqtt_topic_cb);
      triesToReconnect = 3;
      Serial.println("subscribed mqtt");
      return;
    }
    delay(2000);
  }
}