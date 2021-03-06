'use strict';

const awsIot = require("aws-iot-device-sdk");
const path = require('path');
const certsFolderPath = path.resolve('certs');

class IOTClient {

  connect(configs) {
    return new Promise((resolve, reject) => {
      this.device = awsIot.device({
        keyPath: `${certsFolderPath}/${configs.keyFileName}`,
        certPath: `${certsFolderPath}/${configs.certFileName}`,
        caPath: `${certsFolderPath}/${configs.caFileName}`,
        clientId: configs.clientId + Date.now(),
        region: configs.region,
        host: configs.host
      });

      this.device.on("connect", () => {
        console.log("Connected to AWS IoT");
        resolve();
      });
      this.device.on('error', (error) => {
        console.log('error', error);
        reject(error);
      });
      this.device.on('reconnect', () => {
        console.log('reconnect');
      });
      this.device.on('offline', () => {
        console.log('offline');
      });
    });
  }

  subscribe(topic, options) {
    this.device.subscribe(topic, options, () => {
      console.log("Subscribed: " + topic);
    });
  }

  onDifferentMessages(callbacks , caller) {
    this.device.on('message', (topic, payload) => {
      let message = payload.toString();
      message = JSON.parse(message);
      let callbackName = message.dataType;
      let callback = callbacks[callbackName];
      if (!callback) {
        console.log('not known command ' + callbackName);
        return;
      }
      console.log("iot message received from " + topic + " message: " + payload);
      callback(topic, message, caller);
    });
  }
  onSingleMessage(listenerFunction) {
    this.device.on('message', (topic, payload) => {
      listenerFunction(topic, payload);
    });
  }

  publish(topic, message, options) {
    return new Promise((resolve, reject) => {
      this.device.publish(topic, JSON.stringify(message), options, function (err) {
        if (!err) {
          console.log("iot message published successfully: " + topic + " message " + JSON.stringify(message));
          resolve();
        }
        else {
          reject(err);
        }
      });
    });

  }

  disconnect() {
    this.device.end();
  }

}

module.exports = IOTClient;
