var Cylon = require('cylon');
var mraa = require('mraa');

Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: 'mqtt://localhost:1883' }
  },

  devices: {
    socket1: { driver: 'mqtt', topic: 'socket1' },
    socket2: { driver: 'mqtt', topic: 'socket2' },
    socket3: { driver: 'mqtt', topic: 'socket3' },
    socket4: { driver: 'mqtt', topic: 'socket4' }
  },

  work: function(my) {
    var sockets = {
      "socket1": mraa.Gpio(2),
      "socket2": mraa.Gpio(3),
      "socket3": mraa.Gpio(4),
      "socket4": mraa.Gpio(5)
    };
    
    for(socket in sockets){
      my.connections.server.subscribe(socket);
    }

    var command = {
      "on": 1,
      "off": 0
    };

    my.connections.server.on('message', function (channel, data) {
      sockets[channel].dir(mraa.DIR_OUT);
      sockets[channel].write(command[data.toString()]);
    });

  }
}).start();
