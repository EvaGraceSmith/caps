'use strict';

const port = process.env.PORT || 3000;
const io = require('socket.io')(port);
// The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
// Each Vendor and Driver Client will connect to the caps namespace.
const capsNamespace = io.of('/caps');
const Queue = require('./lib/queue');
let messageQueue = new Queue();

// function logger(event, payload){
//   const timestamp = new Date();
//   console.log('EVENT: ', { event, timestamp, payload });
// }


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
    console.log('EVENT:', { event: 'pickup', payload });
    // DONE: step ONE.  store all messages in queue
    let currentQueue = messageQueue.read(payload.driverId);
    // first time we run our server, this queue won't exist.  we need validation
    if(!currentQueue){
      let queueKey = messageQueue.store(payload.driverId, new Queue);
      currentQueue = messageQueue.read(queueKey);
    }
    // now that we KNOW we have a currentQueue, lets store the incoming message
    // because that unique messageId is a string, JavaScript will maintain order for us.
    currentQueue.store(payload.orderId, payload);
    capsNamespace.emit('pickup', payload);
  });


  socket.on('in-transit', (payload) => {
    console.log('EVENT:', { event: 'in-transit', payload });
    // DONE: step ONE.  store all messages in queue
    let currentQueue = messageQueue.read(payload.driverId);
    // first time we run our server, this queue won't exist.  we need validation
    if(!currentQueue){
      let queueKey = messageQueue.store(payload.driverId, new Queue);
      currentQueue = messageQueue.read(queueKey);
    }
    // now that we KNOW we have a currentQueue, lets store the incoming message
    // because that unique messageId is a string, JavaScript will maintain order for us.
    currentQueue.store(payload.orderId, payload);
    capsNamespace.emit('in-transit', payload);

  });


  socket.on('delivered', (payload) => {
    console.log('EVENT:', { event: 'delivered', payload });
    capsNamespace.to(payload.store).emit('delivered', payload);
  });


  socket.on('received', (messageId) => {
    console.log('EVENT:', { event: 'received', messageId });
    // step TWO.  remove messages from queue
    let currentQueue = messageQueue.read(messageId);
    if(!currentQueue) {
      throw new Error('we have messages but no queue!');
    }
    let message = currentQueue.remove(messageId);
    capsNamespace.emit('received', message);
  });


  //TODO: Step THREE.  create an event called GET-MESSAGES, that the recipient can emit so that they can obtain any missed messages
  socket.on('get-all-my-orders', (payload) => {
    console.log('attempting to get messages');
    let currentQueue = messageQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data){
      // getting a list of all message
      Object.keys(currentQueue.data).forEach(messageId => {
        // sending saved messages that were missed by recipient
        // maybe sending to the correct room also works (if two vendors)
        socket.emit('MESSAGE', currentQueue.read(messageId));
      });
    }
  });


  socket.on('disconnect', () => {
    console.log('Vendor/Driver disconnected:', socket.id);
  });
});
//todo: step THREE.  emit get-messages from queue
console.log('CAPS hub is up and running on port', port);
