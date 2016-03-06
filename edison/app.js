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
    laser: { driver: 'led', pin: 13 },
    rgb_led: { driver: 'rgb-led', redPin: 2, greenPin: 3, bluePin: 4 },

    //inputs:
    tilt: { driver: 'button', pin: 4 },
    ambient: { driver: 'analog-sensor', pin: 0, lowerLimit: 100, upperLimit: 900 },
    color_detector: { driver: 'analog-sensor', pin: 1, lowerLimit: 0, upperLimit: 1024 },

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

    var calibrate(){
            setRed();
            after((0.001).seconds(), function() {
                getReading(5, function(avgRead){
                    whiteArray.red = avgRead;
                });
            }

            digitalWrite(ledArray[i], LOW);
            delay(100);
        }


        }
    var getReading = function(num, cb){
        if (num ===0){
            cb();
        }

    }
    every((1).seconds(), function() {
      console.log("Hello, human!");
    });
    after((0.5).seconds(), function() {
        setRed();
        after((0.001).seconds(), function() {
         getReading(5);
         whiteArray[i] = avgRead;
         digitalWrite(ledArray[i], LOW);
         delay(100);
      }

    });


    });
  }
});


}).start();
