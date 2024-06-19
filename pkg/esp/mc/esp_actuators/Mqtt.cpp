#include "Mqtt.h"

#define DEBUG_ESP_PORT Serial

#ifdef DEBUG_ESP_PORT
#define SERIAL_DEBUG(...) DEBUG_ESP_PORT.printf(__VA_ARGS__)
#else
#define SERIAL_DEBUG(...)
#endif

#define MQTT_PING_INTERVAL 10000
#define MQTT_CONNECT_INTERVAL 10000
#define WIFI_CHECK_INTERVAL 10000
#define BATTERY_CHECK_INTERVAL 10000

#define MQTT_TOPIC_LENGTH_MAX 128
#define MQTT_PAYLOAD_LENGTH_MAX 1024

#define WIFI_FAIL 0
#define WIFI_CONNECTED 1
#define WS_DISCONNECTED 2
#define WS_CONNECTED 3
#define MQTT_CONNECTED 4

byte WS_MQTT_status = WIFI_FAIL;

// MQTT Broker settings
const char *mqtt_broker = "monorail.proxy.rlwy.net";
const char *mqtt_topic = "actuators/data";       // MQTT topic
const char *mqtt_topic_cb = "clientDevicesData"; // MQTT topic
const char *mqtt_username = "sensors"; // MQTT username for authentication
const char *mqtt_password = "public";  // MQTT password for authentication
const char *mqtt_domain = "/";
const int mqtt_port = 15431; // MQTT port (TCP)
const int push_interval =
    20000; // Interval in milliseconds to push data to MQTT broker
const static int MQTT_ALIVE_TIME = 30;
const int mqtt_reconnect_interval = 15000;

BlockNot timer(push_interval);
BlockNot realTimer(200);
Storage mqttStorage;
AppDevices mqttDevices;
DynamicJsonDocument doc(1024);
DynamicJsonDocument desDocs(1024);

WebSocketsClient webSocket;

long lastTimeMQTTActive = -10000;
long lastTimeMQTTConnect = 0;
int mqtt_feedback_count = 0;
long lastTimeMQTTPublish = 0;

byte MQTT_package_id = 2;
static uint8_t bufferMQTTPing[2] = {192, 0};
static uint8_t MQTTConnectHeader[12] = {16, 78, 0, 4,   77, 81,
                                        84, 84, 4, 194, 0,  15};
static uint8_t pSubscribeRequest[MQTT_TOPIC_LENGTH_MAX + 7];
static uint8_t pUnSubscribeRequest[MQTT_TOPIC_LENGTH_MAX + 6];
static uint8_t
    pPublishRequest[MQTT_TOPIC_LENGTH_MAX + MQTT_PAYLOAD_LENGTH_MAX + 5];
static uint8_t pConnectRequest[128];

int triesToReconnect = 3;
float waterLevel = 0;
char *json;
String client_id;

#include "MQTT_STACK.h"

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

void MQTT_Payload_Process(char *payload, int payload_length) {
  Serial.println(payload);
  deserializeJson(desDocs, payload, payload_length + 4);
  String value = desDocs["value"];
  String key = desDocs["DeviceValueSetup"]["key"];
    Serial.println(value.c_str());
  if (value != NULL) {
    mqttDevices.changeDeviceStateByKey(key, value == "true" ? true : false);
    doc.clear();
  }
}

void MQTT_Callback(uint8_t *MSG_payload, size_t MSG_length) {
  if (WS_MQTT_status == MQTT_CONNECTED) {
    if (MSG_length == 2) {
      if (MSG_payload[0] == 208 && MSG_payload[1] == 0) {
        mqtt_feedback_count = 0;
        SERIAL_DEBUG("MQTT PING RESPONSE\n");
      }
    }
    if (MSG_length > 4) {
      if (MSG_payload[0] == 48) {
        if (MSG_length > 127 + 2) {
          if ((MSG_payload[2] - 1) * 128 + MSG_payload[1] + 3 == MSG_length) {
            char mqtt_payload[MSG_length - 5 - MSG_payload[4]];
            for (int i = 5 + MSG_payload[4]; i < MSG_length; i++) {
              mqtt_payload[i - 5 - MSG_payload[4]] = (char)MSG_payload[i];
            }
            MQTT_Payload_Process(mqtt_payload, MSG_length - 5 - MSG_payload[4]);
          }
        } else if (MSG_payload[1] + 2 == MSG_length) {
          char mqtt_payload[MSG_length - 4 - MSG_payload[3]];
          for (int i = 4 + MSG_payload[3]; i < MSG_length; i++) {
            mqtt_payload[i - 4 - MSG_payload[3]] = (char)MSG_payload[i];
          }
          MQTT_Payload_Process(mqtt_payload, MSG_length - 4 - MSG_payload[3]);
        }
      }
    }
  } else if (WS_MQTT_status == WS_CONNECTED) {
    if (MSG_length == 4) {
      if (MSG_payload[0] == 32 && MSG_payload[3] == 0) {
        WS_MQTT_status = MQTT_CONNECTED;
        AllDevicesData data = mqttDevices.getAllDevicesData();
        json = prepareData(data);
        Publish_Stach_Push(mqtt_topic_cb, "SUBSCRIBE");
        Publish_Stach_Push(mqtt_topic, json);
        SERIAL_DEBUG("MQTT CONNECTED\n");
      }
    }
  }
}

void wsCallbackEvent(WStype_t MSG_type, uint8_t *MSG_payload,
                     size_t MSG_length) {

  switch (MSG_type) {
  case WStype_DISCONNECTED: {

    WS_MQTT_status = WS_DISCONNECTED;
    SERIAL_DEBUG("WEBSOCKET DISCONNECTED\n");

    break;
  }
  case WStype_CONNECTED: {
    WS_MQTT_status = WS_CONNECTED;
    SERIAL_DEBUG("WEBSOCKET CONNECTED\n");
    break;
  }
  case WStype_TEXT:
    break;
  case WStype_BIN: {
    MQTT_Callback(MSG_payload, MSG_length);
    break;
  }
  }
}

void MQTT_Loop() {
  webSocket.loop();

  if (WS_MQTT_status == MQTT_CONNECTED) {

    Publish_Stack_Pop();

    if (millis() - lastTimeMQTTActive > MQTT_PING_INTERVAL) {
      if (mqtt_feedback_count > 2) {
        WS_MQTT_status = WS_DISCONNECTED;
        webSocket.disconnect();

        mqtt_feedback_count = 0;

        lastTimeMQTTConnect = millis();
      } else {
        webSocket.sendBIN(bufferMQTTPing, 2);
        SERIAL_DEBUG("MQTT PING REQUEST WITH FEEDBACK COUNT %d\n",
                     mqtt_feedback_count);
        mqtt_feedback_count++;
      }
      lastTimeMQTTActive = millis();
    }
  }

  else if (WS_MQTT_status == WS_CONNECTED) {

    if ((millis() - lastTimeMQTTConnect) > MQTT_CONNECT_INTERVAL) {
      // MQTT_CONNECT("ArduinoClient-" + WiFi.macAddress() + "-" +
      // String(millis()), MQTT_ALIVE_TIME, MQTT_username, MQTT_password);
      MQTT_CONNECT(client_id, MQTT_ALIVE_TIME, mqtt_username, mqtt_password);
      lastTimeMQTTConnect = millis();
    }
  }
}

void Mqtt::publishData() {
  AllDevicesData data = mqttDevices.getAllDevicesData();

  json = prepareData(data);
  Publish_Stach_Push(mqtt_topic, json);
  // mqtt_client.publish(mqtt_topic, json);
}

void Mqtt::init() {
  int tryDelay = 1000;
  int numberOfTries = 3;
  Config globalConfig = mqttStorage.getProperties();

  if (strlen(globalConfig.homeSlug) < 3 || globalConfig.homeSlug == "" ||
      globalConfig.homeSlug == NULL) {
    return;
  }
  WS_MQTT_status = WIFI_CONNECTED;
  client_id = String("esp8266-") + globalConfig.homeSlug + String("-") +
              String(WiFi.macAddress());
  webSocket.setReconnectInterval(mqtt_reconnect_interval);
  webSocket.begin(mqtt_broker, mqtt_port, mqtt_domain);
  // wss / SSL is not natively supported !
  // webSocket.beginSSL(mqtt_server, mqtt_port,"/");
  webSocket.onEvent(wsCallbackEvent);
  WS_MQTT_status = WS_DISCONNECTED;
}
void Mqtt::checkingToPublish() {
  // mqtt_client.loop();
  if (WS_MQTT_status >= WS_DISCONNECTED) {
    MQTT_Loop();
  }
  if (WS_MQTT_status == MQTT_CONNECTED) {
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
        Publish_Stach_Push(mqtt_topic, result);
      }
    }
  }
}