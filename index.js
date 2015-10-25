var Cylon = require('cylon');
var mraa = require('mraa');

Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: 'mqtt://192.168.1.90:1883' }
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
    my.connections.server.subscribe("lordIsHere");

    var commands = {
      "on": 1,
      "off": 0
    };

    my.connections.server.on('message', function (channel, data) {
      if(channel in sockets){
        sockets[channel].dir(mraa.DIR_OUT);
        sockets[channel].write(commands[data.toString()]);
        my.connections.server.publish(channel+'/answer', 'SUCCESS');  
      }
      if (channel == "lordIsHere") {
        var states = [];
        for(socket in sockets){
          states[socket] = socket.read();
        }
        my.connections.server.publish("socketsMyLord", JSON.stringify(states)); 
      }    
    });
  }
}).start();
