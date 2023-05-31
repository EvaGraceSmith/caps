'use strict';

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const capsNamespace = io.of('/caps');

capsNamespace.on('connection', (socket) => {
  console.log('Vendor/Driver connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('pickup', (payload) => {
    console.log('EVENT:', { event: 'pickup', payload });
    capsNamespace.emit('pickup', payload);
  });

  socket.on('in-transit', (payload) => {
    console.log('EVENT:', { event: 'in-transit', payload });
    capsNamespace.to(payload.store).emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    console.log('EVENT:', { event: 'delivered', payload });
    capsNamespace.to(payload.store).emit('delivered', payload);
  });

  socket.on('received', (messageId) => {
    console.log('EVENT:', { event: 'received', messageId });
    capsNamespace.emit('received', messageId);
  });

  socket.on('disconnect', () => {
    console.log('Vendor/Driver disconnected:', socket.id);
  });
});

console.log('CAPS hub is up and running on port', port);
