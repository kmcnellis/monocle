// Define color sensor LED pins
int ledArray[] = {4,5,6};

// boolean to know if the balance has been set
boolean balanceSet = false;

//place holders for color detected
int red = 0;
int green = 0;
int blue = 0;

//floats to hold color arrays
float colorArray[] = {0,0,0};
float whiteArray[] = {0,0,0};
float blackArray[] = {0,0,0};

float avgArray[] = {0,0,0};

//place holder for average
int avgRead;

void setup() {
 
  //rgb led outputs
  pinMode(4,OUTPUT);
  pinMode(5,OUTPUT);
  pinMode(6,OUTPUT);

  Serial.begin(9600);
}

void loop() {
  checkBalance();
  checkcolor();
  printcolor();
}

void checkBalance() {
  //check if the balance has been set, if not, set it
  if(balanceSet == false){
    setBalance();
  }
}

void setBalance() {
  //set white balance
  delay(5000);
  for(int i = 0; i <= 2; i++) {
     digitalWrite(ledArray[i], HIGH);
     delay(100);
     getReading(5);
     whiteArray[i] = avgRead;
     digitalWrite(ledArray[i], LOW);
     delay(100);
  }
   //set black balance
  delay(5000);
  for(int i = 0; i<=2; i++) {
     digitalWrite(ledArray[i], HIGH);
     delay(100);
     getReading(5);
     blackArray[i] = avgRead;
     digitalWrite(ledArray[i], LOW);
     delay(100);
  }
  
  balanceSet = true;
  delay(5000);
}

void checkcolor() {
  for(int i = 0; i<=2; i++) {
    digitalWrite(ledArray[i], HIGH);
    delay(100);
    getReading(5);
    colorArray[i] = avgRead;
    float greyDiff = whiteArray[i] - blackArray[i];
    colorArray[i] = (colorArray[i] - blackArray[i]) / (greyDiff) * 255; //the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value 
                                                                    //for the current reflectivity(for the color it is exposed to) of what is being scanned
    digitalWrite(ledArray[i], LOW);
    updateAvg(i);
    delay(100);
  }
}

void updateAvg(int n) {
  avgArray[n] = (avgArray[n] + colorArray[n]) / 2;
}

void getReading(int times) {
  int reading;
  int tally = 0;

  for(int i = 0; i < times; i++) {
    reading = analogRead(0);
    tally = reading + tally;
    delay(10);
  }

  avgRead = (tally) / times;
}

void printcolor() {
  if(avgArray[0] > avgArray[1] && avgArray[0] > avgArray[2]) {
    Serial.println("Red");
  }
  else if(avgArray[1] > avgArray[0] && avgArray[1] > avgArray[2]) {
    Serial.println("Green");
  }
  else {
    Serial.println("Blue");
  }
  Serial.println();
}

