let middleware = require('socketio-wildcard')();

class SocketServer {
  constructor(io) {
    this.io = io;
  }

  connect(path, callbacks , caller) {
    let self = this;
    self.io = self.io.of(path);
    self.io.use(middleware);

    self.io.on('connection', function (socket) {
      console.log('client has been connected to '+ path);
      self.socket = socket;
      self.listen(callbacks , caller);
    });
  }

  listen(callbacks , caller) {
    this.socket.on('*', function (packet) {
      let callbackName = packet.data[0];
      let receivedMessage = packet.data[1];
      let callback = callbacks[callbackName];
      if (!callback) {
        console.log('not known message ' + callbackName);
        return;
      }
      console.log("socket message received from " + callbackName + " message : " + receivedMessage);
      callback(receivedMessage , caller);
    });
  }

  emitEvent(eventName, message) {
    return new Promise((resolve, reject) => {
      this.socket.broadcast.emit(eventName, message);
      console.log("socket message published successfully: " + eventName + " message " + message);
      resolve();
    });
  }

};
module.exports = SocketServer;