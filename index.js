var Cylon = require('cylon');
var mraa = require('mraa');

Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: 'mqtt://192.168.1.90:1884' }
  },

  devices: {
    socket1: { driver: 'mqtt', topic: 'socket1' },
    socket2: { driver: 'mqtt', topic: 'socket2' },
    socket3: { driver: 'mqtt', topic: 'socket3' },
    socket4: { driver: 'mqtt', topic: 'socket4' }
  },

  work: function(my) {
    var sockets = {
      "socket1": new mraa.Gpio(2),
      "socket2": new mraa.Gpio(3),
      "socket3": new mraa.Gpio(4),
      "socket4": new mraa.Gpio(5)
    };
    
    for(socket in sockets){
      my.connections.server.subscribe(socket);
    }

    var commands = {
      "on": 1,
      "off": 0
    };

    my.connections.server.on('message', function (channel, data) {
      debugger;
      sockets[channel].dir(mraa.DIR_OUT);
      sockets[channel].write(commands[data.toString()]);
    });
  }
}).start();
