var Cylon = require('cylon');
var mraa = require('mraa');

Cylon.robot({
  connections: {
    server: { adaptor: 'mqtt', host: 'mqtt://192.168.1.90:1883' }
  },

  work: function(my) {
    var sockets = {
      "socket1": new mraa.Gpio(2),
      "socket2": new mraa.Gpio(3),
      "socket3": new mraa.Gpio(4),
      "socket4": new mraa.Gpio(5)
    };

    var behaviour = {
      "lordIsHere": function () {
        var states = {};
        for(socket in sockets){
          states[socket] = sockets[socket].read();
        }
        my.connections.server.publish('socketsMyLord', JSON.stringify(states));
      }      
    }

    for(socket in sockets){
      behaviour[socket] = function (data) {
        sockets[socket].dir(mraa.DIR_OUT);
        sockets[socket].write(commands[data.toString()]);
        my.connections.server.publish(socket+'/answer', 'success');
      }
    }

    for(channel in behaviour){
      my.connections.server.subscribe(channel);
    }

    var commands = {
      "on": 1,
      "off": 0
    };

    my.connections.server.on('message', function (channel, data) {
      behaviour[channel](data);
    });
  }
}).start();
