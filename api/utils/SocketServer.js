let middleware = require('socketio-wildcard')();

class SocketServer {

  connect(io) {
    return new Promise((resolve, reject) => {
      let self = this;
    self.io = io;
    self.io.use(middleware);
    self.io.on('connection', function (socket) {
      console.log('client has been connected');
      self.socket = socket;
      resolve();
    });
    });
  }

  onMessage(callbacks , caller) {
    /* the name of the callback is the name of the event received */
    this.socket.on('*', function (packet) {
      let eventName = packet.data[0];
      let receivedMessage = packet.data[1];
      let callback = callbacks[eventName];
      if (!callback) {
        console.log('not known message ' + eventName);
        return;
      }
      console.log("socket message received from " + eventName + " message : " + receivedMessage);
      callback(receivedMessage , caller);
    });
  }

  emitEvent(eventName, message) {
    let self = this;
    return new Promise((resolve, reject) => {
      if(!self.socket){
        reject('there is no client connected');
        return;
      }
      self.socket.emit(eventName, message);
      console.log("socket message published successfully: " + eventName + " message " + message);
      resolve();
    });
  }

};
module.exports = SocketServer;
