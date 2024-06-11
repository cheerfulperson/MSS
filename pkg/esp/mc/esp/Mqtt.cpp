#include "Mqtt.h"

// MQTT Broker settings
const char* mqtt_broker = "192.168.0.119";  // EMQX broker endpoint
const char* mqtt_topic = "sensors/data";     // MQTT topic
const char* mqtt_username = "sensors";  // MQTT username for authentication
const char* mqtt_password = "public";  // MQTT password for authentication
const int mqtt_port = 1883;  // MQTT port (TCP)
const int push_interval = 20000;  // Interval in milliseconds to push data to MQTT broker

WiFiClient espClient;
PubSubClient mqtt_client(espClient);
Storage mqttStorage;
AppSensors mqttSensors;
Neotimer timer = Neotimer(push_interval);

void mqttCallback(char* topic, byte* payload, unsigned int length) {
}

char* prepareData(AllSensorsData data) {
    String json;
    DynamicJsonDocument doc(2048);
    doc["temperature"] = data.temperature;
    doc["co"] = data.co;
    doc["humidity"] = data.humidity;
    doc["pressure"] = data.pressure;
    doc["aht20Temperature"] = data.aht20Temperature;
    doc["aht20Humidity"] = data.aht20Humidity;
    doc["bmpTemperature"] = data.bmpTemperature;
    serializeJson(doc, json);
    return (char*)json.c_str();
}

void Mqtt::publishData() {
    AllSensorsData data;
    data.temperature = mqttSensors.getAverageTemperature();
    data.co = mqttSensors.getCOGassPPM();
    data.humidity = mqttSensors.getAverageHumidity();
    data.pressure = mqttSensors.getBMPData().pressure;
    char* json = prepareData(data);
    mqtt_client.publish(mqtt_topic, json);
}

void Mqtt::init() {
    int tryDelay = 1000;
    int numberOfTries = 3;
    Config globalConfig = mqttStorage.getProperties();
    AllSensorsData data;
    char* json = prepareData(data);

    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setCallback(mqttCallback);

    if (strlen(globalConfig.homeSlug) < 3 || globalConfig.homeSlug == "" || globalConfig.homeSlug == NULL) {
        return;
    }

    while (!mqtt_client.connected()) {
        String client_id = String("esp8266-") + globalConfig.homeSlug + String("-") + String(WiFi.macAddress());
        if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            mqtt_client.subscribe(mqtt_topic);
            // Publish message upon successful connection to sent schema to the broker
            mqtt_client.publish(mqtt_topic, json);
        }
        else {
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
