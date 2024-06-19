#include "AppDevices.h"

#define WATER_LEVEL_PIN A0
#define LIGHT1_PIN D0
#define LIGHT2_PIN D7
#define LIGHT3_PIN D1
#define LIGHT4_PIN D2
#define LIGHT5_PIN D3
#define LIGHT6_PIN D4
#define LIGHT7_PIN D5
#define PLUG1_PIN D6
#define SERVO_PIN D8

int pos = 0;

Servo myservo;
AllDevicesData result;

void AppDevices::init() {
  // Start up the library
  myservo.attach(SERVO_PIN);
  pinMode(LIGHT1_PIN, OUTPUT);
  pinMode(LIGHT2_PIN, OUTPUT);
  pinMode(LIGHT3_PIN, OUTPUT);
  pinMode(LIGHT4_PIN, OUTPUT);
  pinMode(LIGHT5_PIN, OUTPUT);
  pinMode(LIGHT6_PIN, OUTPUT);
  pinMode(LIGHT7_PIN, OUTPUT);
  pinMode(PLUG1_PIN, OUTPUT);
}

float readWaterSensor() {
  return analogRead(WATER_LEVEL_PIN); // send current reading
}

void changeServoPosition(bool value) {
  if (value) {
    for (pos = 0; pos <= 180; pos += 5) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo.write(pos); // tell servo to go to position in variable 'pos'
      delay(15);          // waits 15ms for the servo to reach the position
    }
  } else {
    for (pos = 180; pos >= 0; pos -= 5) { // goes from 180 degrees to 0 degrees
      myservo.write(pos); // tell servo to go to position in variable 'pos'
      delay(15);          // waits 15ms for the servo to reach the position
    }
  }
}

void AppDevices::changeDeviceStateByKey(String key, bool value) {
  int lightValue = value == true ? HIGH : LOW;

  if (strcmp(key.c_str(), "motor") == 0) {
    changeServoPosition(value);
    return;
  }
  if (strcmp(key.c_str(), "light1") == 0) {
    digitalWrite(LIGHT1_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light2") == 0) {
    digitalWrite(LIGHT2_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light3") == 0) {
    digitalWrite(LIGHT3_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light4") == 0) {
    digitalWrite(LIGHT4_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light5") == 0) {
    digitalWrite(LIGHT5_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light6") == 0) {
    digitalWrite(LIGHT6_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "light7") == 0) {
    digitalWrite(LIGHT7_PIN, lightValue);
    return;
  }
  if (strcmp(key.c_str(), "plug1") == 0) {
    digitalWrite(PLUG1_PIN, value == true ? LOW : HIGH);
    return;
  }
}

AllDevicesData AppDevices::getAllDevicesData() {
  result.plug1 = digitalRead(PLUG1_PIN) == LOW;
  result.audio = false;
  result.motor = pos == 180;
  result.light1 = digitalRead(LIGHT1_PIN) == HIGH;
  result.light2 = digitalRead(LIGHT2_PIN) == HIGH;
  result.light3 = digitalRead(LIGHT3_PIN) == HIGH;
  result.light4 = digitalRead(LIGHT4_PIN) == HIGH;
  result.light5 = digitalRead(LIGHT5_PIN) == HIGH;
  result.light6 = digitalRead(LIGHT6_PIN) == HIGH;
  result.light7 = digitalRead(LIGHT7_PIN) == HIGH;
  result.waterLevel = readWaterSensor();
  return result;
}
