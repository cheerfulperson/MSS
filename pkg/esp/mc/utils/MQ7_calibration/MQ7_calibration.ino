int CO_sensorPin = A0;  // select the input pin for the CO sensor
void setup() {
  Serial.begin(115200);            //Baud rate
  pinMode(CO_sensorPin, INPUT);  // To get input from the sensor
}
void loop() {
  float CO_VRL;               //Define variable for sensor voltage
  float CO_RS;                //Define variable for sensor resistance
  float CO_R0;                //Define variable for R0
  float CO_sensorRead = 0.0;  //Define variable for analog readings
  float CO_RL = 10;           //Load Resistance (Units are Kilo Ohms)
  float CO_VC = 5.0;          //Supply DC voltage
  //****MQ-7****
  // read the value from the sensor and calculations:
  CO_sensorRead = analogRead(CO_sensorPin);   //Read analog values of sensor
  CO_VRL = CO_sensorRead * (CO_VC / 1023.0);  //Convert Sensor analog signal to voltage
  CO_RS = ((CO_VC / CO_VRL) - 1) * CO_RL;     //Calculate RS (sensor resistance) in fresh air
  CO_R0 = CO_RS / 25.75;                      //Calculate R0 I got 25.75 from the graph in the data sheet
  Serial.print("Sensor resistance in ambient air RO ");
  Serial.print(CO_sensorRead);
  delay(1000);  //Wait 1 second
}