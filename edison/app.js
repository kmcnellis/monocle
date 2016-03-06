"use strict";

var Cylon = require('cylon')

Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },
  devices: {
    //outputs:
    laser: { driver: 'led', pin: 13 },
    rgb_led: { driver: 'rgb-led', redPin: 3, greenPin: 5, bluePin: 6 },

    //inputs:
    button: { driver: 'button', pin: 2 }

  },
  work: function(my) {
    my.button.on('push', function() {
      my.led.toggle();
    });
  },

  detect_color: function() {

  },

  output_sound: function(color) {

  },

  warn_distance: function() {

  },

  warn_tilt: function() {

  }

}).start();
