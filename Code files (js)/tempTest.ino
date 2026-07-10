

#include <OneWire.h>
#include <DallasTemperature.h>

// Pin where the DS18B20 is connected
#define ONE_WIRE_BUS 2

// Set up OneWire communication
OneWire oneWire(ONE_WIRE_BUS);

// Pass the oneWire reference to DallasTemperature
DallasTemperature sensors(&oneWire);

void setup() {
  // Start serial communication
  Serial.begin(9600);
  
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  digitalWrite(3, LOW);
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  // Start the temperature sensor
  sensors.begin();

}

void loop() {
  // Request temperature reading from DS18B20
  sensors.requestTemperatures();

  // Print temperature to the serial monitor
  float temperatureC = sensors.getTempCByIndex(0);
  Serial.println(temperatureC);

  //Determines which light to turn on 
  if (temperatureC < 22.75) {
    digitalWrite(3, HIGH);
  	digitalWrite(4, LOW);
  	digitalWrite(5, LOW);
  	digitalWrite(6, LOW);
  }
  else if (temperatureC < 23.50) {
    digitalWrite(3, LOW);
  	digitalWrite(4, LOW);
  	digitalWrite(5, HIGH);
  	digitalWrite(6, LOW);
  }
   else if (temperatureC < 24.50) {
    digitalWrite(3, LOW);
  	digitalWrite(4, LOW);
  	digitalWrite(5, LOW);
  	digitalWrite(6, HIGH);
  }
   else {
    digitalWrite(3, LOW);
  	digitalWrite(4, HIGH);
  	digitalWrite(5, LOW);
  	digitalWrite(6, LOW);
  }
  
  // Wait 1/2 second before repeating
  delay(500);

}
