var Cylon = require('cylon');

Cylon.robot({
  connections: {
    edison: { adaptor: 'intel-iot' }
  },

  devices: {
    sensor: { driver: 'analog-sensor', pin: 0, lowerLimit: 300, upperLimit: 1000 }
  },

  work: function(my) {
    
    var analogValue = 0;

    every((1).second(), function() {
      analogValue = my.sensor.analogRead();
      console.log('Analog value => ', analogValue);
    });

    my.sensor.on('lowerLimit', function(val) {
      console.log("Lower limit reached!");
      console.log('Analog value => ', val);
    });

    my.sensor.on('upperLimit', function(val) {
      console.log("Upper limit reached!");
      console.log('Analog value => ', val);
    });
  }
}).start();
