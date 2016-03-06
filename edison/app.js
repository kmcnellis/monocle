"use strict";

var Cylon = require('cylon')
var tilted = false;
var talking = false;
var leds = {red:2,blue:3,green:4};
var color = "";
var whiteArray = {red:0,blue:0,green:0};
var blackArray = {red:0,blue:0,green:0};
var colorArray = {red:0,blue:0,green:0};
var avgArray = {red:0,blue:0,green:0};

require('shelljs/global');

Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },
  devices: {
    //outputs:
    laser: { driver: 'led', pin: 7 },
    redLed: { driver: 'led', pin: 4 },
    greenLed: { driver: 'led', pin: 5 },
    blueLed: { driver: 'led', pin: 6 },

    //inputs:
    tilt: { driver: 'button', pin: 3 },
    button: { driver: 'button', pin: 2 },
    ambient: { driver: 'analog-sensor', pin: 3, lowerLimit: 100, upperLimit: 900 },
    color_detector: { driver: 'analog-sensor', pin: 0, lowerLimit: 0, upperLimit: 1024 },

  },
  work: function(my) {
    my.button.on('push', function() {
      my.laser.toggle();
    console.log("laser toggled");

    });

    every((1).seconds(), function() {
      console.log("Hello, human!");
    });

    var output_sound= function(color) {
    console.log(color + " detected");
    if (!talking){
        if (color === "red"){
            exec('sh red.sh');
        }
        if (color === "green"){
            exec('sh green.sh');
        }
        if (color === "blue"){
            exec('sh blue.sh');
        }
    }
    };

      my.tilt.on('push', function() {
          console.log("Tilt Activated");
          tilted = true;
      });
      my.tilt.on('release', function() {
          console.log("Tilt Deactivated");
          tilted = false;
      });

      var setRed = function(){
          my.redLed.turnOn()
          my.greenLed.turnOff()
          my.blueLed.turnOff()
      };
      var setBlue = function(){
          my.redLed.turnOff()
          my.greenLed.turnOff()
          my.blueLed.turnOn()
      }
      var setGreen = function(){
          my.redLed.turnOff()
          my.greenLed.turnOn()
          my.blueLed.turnOff()
      }
      var setOff = function(){
          my.redLed.turnOff()
          my.greenLed.turnOff()
          my.blueLed.turnOff()
      }

    var calibrate = function(cb){
            setRed();
            after((0.1).seconds(), function() {
                getReading(5, function(avgRead){
                    whiteArray.red = avgRead;
                    console.log("Set white red to "+avgRead);
                    setBlue();
                    after((0.1).seconds(), function() {
                        getReading(5, function(avgRead){
                            whiteArray.blue = avgRead;
                            console.log("Set white blue to "+avgRead);
                            setGreen();
                            after((0.1).seconds(), function() {
                                getReading(5, function(avgRead){
                                    whiteArray.green = avgRead;
                                    console.log("Set white green to "+avgRead);
                                    setOff();
                                    after((5).seconds(), function() {
                                        setRed();
                                        after((0.1).seconds(), function() {
                                            getReading(5, function(avgRead){
                                                blackArray.red = avgRead;
                                                console.log("Set black red to "+avgRead);
                                                setBlue();
                                                after((0.1).seconds(), function() {
                                                    getReading(5, function(avgRead){
                                                        blackArray.blue = avgRead;
                                                        console.log("Set black blue to "+avgRead);
                                                        setGreen();
                                                        after((0.1).seconds(), function() {
                                                            getReading(5, function(avgRead){
                                                                blackArray.green = avgRead;
                                                                console.log("Set black green to "+avgRead);
                                                                after((0.1).seconds(), function() {
                                                                    cb();
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

    var getReading = function(times, cb, tally, count){
        if (count ===0){
            var avgRead = (tally) / times;
            return cb(avgRead);
        }
        if (!tally){
            tally=0;
        }
        if (!count){
            count=times;
        }

        var reading = my.ambient.analogRead();
        tally = reading + tally;
        after((0.01).seconds(), function() {
            getReading(times, cb, tally, count-1);
        });
    };


    after((5).seconds(), function() {
        calibrate(function(){
            every((1).seconds(), function() {
              console.log("Check color");
                    setRed();
                    after((0.01).seconds(), function() {
                        getReading(5, function(avgRead){
                            colorArray.red = avgRead;
                            console.log("Set colorArray red to "+avgRead);
                            var greyDiff = whiteArray.red - blackArray.red;
                            colorArray.red = (colorArray.red - blackArray.red) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                            //for the current reflectivity(for the color it is exposed to) of what is being scanned
                            avgArray.red = (avgArray.red + colorArray.red) / 2;

                            setBlue();
                            after((0.01).seconds(), function() {
                                getReading(5, function(avgRead){
                                    colorArray.blue = avgRead;
                                    console.log("Set colorArray blue to "+avgRead);
                                    var greyDiff = whiteArray.blue - blackArray.blue;
                                    colorArray.blue = (colorArray.blue - blackArray.blue) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                                    //for the current reflectivity(for the color it is exposed to) of what is being scanned
                                    avgArray.blue = (avgArray.blue + colorArray.blue) / 2;
                                    setGreen();
                                    after((0.01).seconds(), function() {
                                        getReading(5, function(avgRead){
                                            colorArray.green = avgRead;
                                            console.log("Set colorArray green to "+avgRead);
                                            var greyDiff = whiteArray.green - blackArray.green;
                                            colorArray.green = (colorArray.green - blackArray.green) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                                            //for the current reflectivity(for the color it is exposed to) of what is being scanned
                                            avgArray.green = (avgArray.green + colorArray.green) / 2;
                                            after((0.01).seconds(), function() {
                                                setOff();
                                                if(avgArray.red > avgArray.green && avgArray.red > avgArray.blue) {
                                                    console.log("Detected Red");
                                                    output_sound("red");
                                                }
                                                else if(avgArray.green > avgArray.red && avgArray.green > avgArray.blue) {
                                                    console.log("Detected Green");
                                                    output_sound("green");

                                                }
                                                else {
                                                    console.log("Detected Blue");
                                                    output_sound("blue");
                                                }

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
              });
            });
        });

    } //end setup

}).start();
