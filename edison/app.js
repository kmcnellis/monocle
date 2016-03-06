"use strict";

var Cylon = require('cylon')
var tilted = false;
var Player = require('player');
var talking = false;
var red = new Player('./mp3/red.mp3');
var green = new Player('./mp3/green.mp3');
var blue = new Player('./mp3/blue.mp3');
var leds = {red:2,blue:3,green:4};
var color = "";
var whiteArray = {red:0,blue:0,green:0};
var blackArray = {red:0,blue:0,green:0};
var colorArray = {red:0,blue:0,green:0};


Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },
  devices: {
    //outputs:
    laser: { driver: 'led', pin: 7 },
    rgb_led: { driver: 'rgb-led', redPin: 4, greenPin: 5, bluePin: 6 },

    //inputs:
    tilt: { driver: 'button', pin: 3 },
    button: { driver: 'button', pin: 2 },
    ambient: { driver: 'analog-sensor', pin: 3, lowerLimit: 100, upperLimit: 900 },
    color_detector: { driver: 'analog-sensor', pin: 0, lowerLimit: 0, upperLimit: 1024 },

  },
  work: function(my) {
    my.button.on('push', function() {
      my.laser.toggle();
    });
  },

  detect_color: function() {

  },

  output_sound: function(color) {
    console.log(color + " detected");
    if (!talking){
        if (color === "red"){

            red.play(function(err, player){
                if (err){
                    console.log("Error playing red",err);
                }
                console.log('red playend!');
                talking = false;
            });

        }
        if (color === "green"){
            green.play(function(err, player){
                if (err){
                    console.log("Error playing green",err);
                }
                console.log('green playend!');
                talking = false;
            });
        }
        if (color === "blue"){
            blue.play(function(err, player){
                if (err){
                    console.log("Error playing blue",err);
                }
                console.log('blue playend!');
                talking = false;
            });
        }
    }
  },

  warn_tilt: function() {
    my.tilt.on('push', function() {
      console.log("Tilt Activated");
      tilted = true;
    });
    my.tilt.on('release', function() {
      console.log("Tilt Deactivated");
      tilted = false;
    });

},
  setup: function(my) {
    var setRed = function(){
        my.rgb_led.setRGB("FF0000")
    };
    var setBlue = function(){
        my.rgb_led.setRGB("0000FF")
    }
    var setGreen = function(){
        my.rgb_led.setRGB("00FF00")
    }
    var setOff = function(){
        my.rgb_led.setRGB("000000")
    }

    var calibrate = function(cb){
            setRed();
            after((0.01).seconds(), function() {
                getReading(5, function(avgRead){
                    whiteArray.red = avgRead;
                    console.log("Set white red to "+avgRead);
                    setBlue();
                    after((0.01).seconds(), function() {
                        getReading(5, function(avgRead){
                            whiteArray.blue = avgRead;
                            console.log("Set white blue to "+avgRead);
                            setGreen();
                            after((0.01).seconds(), function() {
                                getReading(5, function(avgRead){
                                    whiteArray.green = avgRead;
                                    console.log("Set white green to "+avgRead);
                                    setOff();
                                    after((5).seconds(), function() {
                                        setRed();
                                        after((0.01).seconds(), function() {
                                            getReading(5, function(avgRead){
                                                blackArray.red = avgRead;
                                                console.log("Set black red to "+avgRead);
                                                setBlue();
                                                after((0.01).seconds(), function() {
                                                    getReading(5, function(avgRead){
                                                        blackArray.blue = avgRead;
                                                        console.log("Set black blue to "+avgRead);
                                                        setGreen();
                                                        after((0.01).seconds(), function() {
                                                            getReading(5, function(avgRead){
                                                                blackArray.green = avgRead;
                                                                console.log("Set black green to "+avgRead);
                                                                after((0.01).seconds(), function() {
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

    var getReading = function(times, cb, tally){
        if (times ===0){
            var avgRead = (tally) / times;
            cb(avgRead);
        }
        if (!tally){
            tally=0;
        }

        var reading = my.ambient.analogRead();
        tally = reading + tally;
        after((0.01).seconds(), function() {
            getReading(times-1, cb, tally);
        });
    };

    every((1).seconds(), function() {
      console.log("Hello, human!");
    });

    after((5).seconds(), function() {
        calibrate(function(){
            every((1).seconds(), function() {
              console.log("Check color");
                    setRed();
                    after((0.01).seconds(), function() {
                        getReading(5, function(avgRead){
                            colorArray.red = avgRead;
                            console.log("Set colorArray red to "+avgRead);
                            var greydiff = whiteArray.red - blackArray.red;
                            colorArray.red = (colorArray.red - blackArray.red) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                            //for the current reflectivity(for the color it is exposed to) of what is being scanned
                            avgArray.red = (avgArray.red + colorArray.red) / 2;

                            setBlue();
                            after((0.01).seconds(), function() {
                                getReading(5, function(avgRead){
                                    colorArray.blue = avgRead;
                                    console.log("Set colorArray blue to "+avgRead);
                                    var greydiff = whiteArray.blue - blackArray.blue;
                                    colorArray.blue = (colorArray.blue - blackArray.blue) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                                    //for the current reflectivity(for the color it is exposed to) of what is being scanned
                                    avgArray.blue = (avgArray.blue + colorArray.blue) / 2;
                                    setGreen();
                                    after((0.01).seconds(), function() {
                                        getReading(5, function(avgRead){
                                            colorArray.green = avgRead;
                                            console.log("Set colorArray green to "+avgRead);
                                            var greydiff = whiteArray.green - blackArray.green;
                                            colorArray.green = (colorArray.green - blackArray.green) / (greyDiff) * 255;//the reading returned minus the lowest value divided by the possible range multiplied by 255 is a value roughly between 0-255 representing the value
                                            //for the current reflectivity(for the color it is exposed to) of what is being scanned
                                            avgArray.green = (avgArray.green + colorArray.green) / 2;
                                            after((0.01).seconds(), function() {
                                                setOff();
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
