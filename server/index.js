'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const { Server } = require('socket.io');
// The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
// Each Vendor and Driver Client will connect to the caps namespace.
const server = new Server();
const capsNamespace = server.of('/caps');
const Queue = require('./lib/queue');
let orderQueue = new Queue();

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
    // let driverQueue = orderQueue.read('driver', payload.store);
    let driverQueue = orderQueue.read('driver');
    // first time we run our server, this queue won't exist.  we need validation
    if(!driverQueue){
      // let driverKey = orderQueue.store('driver', payload.store, new Queue);
      let driverKey = orderQueue.store('driver',  new Queue);
      driverQueue = orderQueue.read(driverKey);
    }
    // now that we KNOW we have a currentQueue, lets store the incoming message
    // because that unique messageId is a string, JavaScript will maintain order for us.
    // driverQueue.store(payload.orderId, payload);
    driverQueue.store(payload.messageId, payload);
    capsNamespace.emit('pickup', payload);
  });


  socket.on('in-transit', (payload) => {
    console.log('EVENT:', { event: 'in-transit', payload });
    capsNamespace.emit('in-transit', payload);

  });


  socket.on('delivered', (payload) => {
    console.log('EVENT:', { event: 'delivered', payload });
    capsNamespace.to(payload.store).emit('delivered', payload);
  });


  socket.on('received', (payload) => {
    console.log('received order ', payload.orderId);
    // step TWO.  remove messages from queue
    let currentQueue = orderQueue.read(payload.store);
    if(!currentQueue) {
      throw new Error('we have messages but no queue!');
    }
    let message = currentQueue.remove(payload.store);
    capsNamespace.emit('received', message);
  });

//get all messages from queue
  //TODO: Step THREE.  create an event called GET-MESSAGES, that the recipient can emit so that they can obtain any missed messages
  socket.on('getAll-delivered-orders', (payload) => {
    console.log('attempting to get messages');
    // let currentQueue = orderQueue.read(payload.store);
    let currentQueue = orderQueue.read(payload.queueId);
    if(currentQueue && currentQueue.data){
      // getting a list of all message
      Object.keys(currentQueue.data).forEach(messageId => {
        // sending saved messages that were missed by recipient
        // maybe sending to the correct room also works (if two vendors)
        let message = currentQueue.read(messageId);
        // socket.emit('delivered', currentQueue.read(messageId));
        socket.emit(payload.event, message);
      });
    }
  });


  socket.on('disconnect', () => {
    console.log('Vendor/Driver disconnected:', socket.id);
  });
});
//todo: step THREE.  emit get-messages from queue
console.log('CAPS hub is up and running on port', port);
server.listen(port);
