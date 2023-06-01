'use strict';

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
// The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
// Each Vendor and Driver Client will connect to the caps namespace.
const capsNamespace = io.of('/caps');

function logger(event, payload){
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}


//The server will emit specific events to each socket that is listening for their designated events from the Global Event Pool defined in the Server.
capsNamespace.on('connection', (socket) => {
  console.log('Vendor/Driver connected:', socket.id);

  //listen for any join events emitted from the client
  socket.on('join', (room) => {

    console.log('Possible rooms -----', socket.adapter.rooms);
    console.log('Payload is in this room ---- ', room);
    socket.join(room);
    console.log('Joined room -----', socket.adapter.rooms);

  });

  socket.on('pickup', (payload) => {
    logger('pickup', payload);
    // console.log('EVENT:', { event: 'pickup', payload });
    capsNamespace.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    logger('in-transit', payload);
    capsNamespace.emit('in-transit', payload);
    // console.log('EVENT:', { event: 'in-transit', payload });
    // capsNamespace.to(payload.store).emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    console.log('EVENT:', { event: 'delivered', payload });
    capsNamespace.to(payload.store).emit('delivered', payload);
  });

  socket.on('received', (messageId) => {
    logger('received', messageId);
    // console.log('EVENT:', { event: 'received', messageId });
    capsNamespace.emit('received', messageId);
  });

  socket.on('disconnect', () => {
    console.log('Vendor/Driver disconnected:', socket.id);
  });
});

console.log('CAPS hub is up and running on port', port);
