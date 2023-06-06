'use strict';

const io = require('socket.io-client');
const capsSocket = io.connect('http://localhost:3000/caps');

const { simulatePickup, handleDelivered, store } = require('./handler');
//capsSocket.emit('getAll', { queueId: '1-206-flowers' }); //was just 'driver'
capsSocket.on('connect', () => {
    console.log('1-206-flowers connected to CAPS hub');

    capsSocket.emit('join', '1-206-flowers');
    capsSocket.emit('getAll', {queueId: '1-206-flowers'});
});

capsSocket.on('disconnect', () => {
    console.log('1-206-flowers disconnected from CAPS hub');
});


capsSocket.on('delivered', (payload) => {
    handleDelivered(capsSocket, payload);
  });

// Simulating new customer orders every 5 seconds
setInterval(() => {
    simulatePickup(capsSocket);
  }, 5000);


