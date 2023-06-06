'use strict';

const io = require('socket.io-client');
const capsSocket = io.connect('http://localhost:3000/caps');
const { simulatePickup, handleDelivered, store } = require('./acme-handler');

capsSocket.on('connect', () => {
  console.log(store, ' connected to CAPS hub');

  capsSocket.emit('join', store);
  capsSocket.emit('getAll', {queueId: store});
});

capsSocket.on('disconnect', () => {
  console.log(store, ' disconnected from CAPS hub');
});

capsSocket.on('delivered', (payload) => {
  handleDelivered(capsSocket, payload);
});

// Simulating new customer orders every 5 seconds
setInterval(() => {
  simulatePickup(capsSocket);
}, 5000);


