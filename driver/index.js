'use strict';

const io = require('socket.io-client');
const capsSocket = io.connect('http://localhost:3000/caps');
const Chance = require('chance');
let chance = new Chance();
let driverId= chance.guid();
capsSocket.emit('getAll', { queueId: 'driver' }); //was just 'driver'

capsSocket.on('connect', () => {
  console.log('Driver connected to CAPS hub');
  capsSocket.emit('join', '1-206-flowers');

  capsSocket.emit('get-all-my-orders', {driverId: `${[driverId]}`});
});


capsSocket.on('disconnect', () => {
  console.log('Driver disconnected from CAPS hub');
});

capsSocket.on('pickup', (payload) => {
  console.log(`Picking up order ${payload.orderId}`);
  //payload.driverId=DriverId;
  capsSocket.emit('in-transit', payload);
});

capsSocket.on('in-transit', (payload) => {
  console.log(`Enroute to deliver order ${payload.orderId}`);
  setTimeout(() => {
    capsSocket.emit('delivered', payload);
  }, 3000);
});

capsSocket.on('delivered', (payload) => {
  console.log(`Delivered order ${payload.orderId}`);
  capsSocket.emit('received', payload);
});

