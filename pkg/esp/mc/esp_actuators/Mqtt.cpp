#include "Mqtt.h"

// MQTT Broker settings
const char *mqtt_broker = "192.168.0.119"; // EMQX broker endpoint
const char *mqtt_topic = "actuators/data"; // MQTT topic
const char *mqtt_username = "sensors";     // MQTT username for authentication
const char *mqtt_password = "public";      // MQTT password for authentication
const int mqtt_port = 1883;                // MQTT port (TCP)
const int push_interval =
    10000; // Interval in milliseconds to push data to MQTT broker

WiFiClient espClient;
PubSubClient mqtt_client(espClient);
Storage mqttStorage;
AppDevices mqttDevices;
Neotimer timer = Neotimer(push_interval);

//  value: jsonParse[key].toString(),
//  treatLevel: TreatLevel.INFO,
//   Device: {
//   id: device.id,
//},
// DeviceValueSetup: {
//   key,
// },

void mqttCallback(char *topic, byte *payload, unsigned int length) {
  if (topic == "client/devices/data") {
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, payload, length);
    String value =  doc["value"];
    String deviceValueSetupJSON = doc["DeviceValueSetup"];
    deserializeJson(doc, deviceValueSetupJSON, deviceValueSetupJSON.length());
    String key = doc["key"];
    mqttDevices.changeDeviceStateByKey(key, value);
  }
}

char *prepareData(AllDevicesData data) {
  String json;
  DynamicJsonDocument doc(2048);
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
  serializeJson(doc, json);
  return (char *)json.c_str();
}

void Mqtt::publishData() {
  AllDevicesData data = mqttDevices.getAllDevicesData();

  char *json = prepareData(data);
  mqtt_client.publish(mqtt_topic, json);
}

void Mqtt::init() {
  int tryDelay = 1000;
  int numberOfTries = 3;
  Config globalConfig = mqttStorage.getProperties();
  AllDevicesData data;
  char *json = prepareData(data);

  mqtt_client.setServer(mqtt_broker, mqtt_port);
  mqtt_client.setCallback(mqttCallback);

  if (strlen(globalConfig.homeSlug) < 3 || globalConfig.homeSlug == "" ||
      globalConfig.homeSlug == NULL) {
    return;
  }

  while (!mqtt_client.connected()) {
    String client_id = String("esp8266-") + globalConfig.homeSlug +
                       String("-") + String(WiFi.macAddress());
    if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      mqtt_client.subscribe(mqtt_topic);
      // Publish message upon successful connection to sent schema to the broker
      mqtt_client.publish(mqtt_topic, json);
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
  if (timer.repeat()) {
    publishData();
  }
}
