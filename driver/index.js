'use strict';

const io = require('socket.io-client');
const capsSocket = io.connect('http://localhost:3000/caps');

capsSocket.on('connect', () => {
  console.log('Driver connected to CAPS hub');
  capsSocket.emit('join', '1-206-flowers', 'acme-widgets');

  capsSocket.emit('getAll', {queueId: 'driver'});
});


capsSocket.on('disconnect', () => {
  console.log('Driver disconnected from CAPS hub');
});

capsSocket.on('pickup', (payload) => {
  console.log(`picking up order ${payload.orderId} from `, payload.store);

  //payload.driverId=DriverId;
  capsSocket.emit('in-transit', payload);
});

capsSocket.on('in-transit', (payload) => {
  console.log(`Enroute to deliver order ${payload.orderId} from ${payload.store}`);
  setTimeout(() => {
    capsSocket.emit('delivered', payload);
  }, 3000);
});

capsSocket.on('delivered', (payload) => {
  console.log(`Delivered order ${payload.orderId} from ${payload.store}`);
  capsSocket.emit('received', payload);
});

