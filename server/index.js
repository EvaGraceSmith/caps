'use strict';

require('dotenv').config();
const port = process.env.PORT || 3000;
const { Server } = require('socket.io');
// The Socket Server will create a namespace of caps that will receive all CAPS event traffic.
// Each Vendor and Driver Client will connect to the caps namespace.
const server = new Server();
const capsNamespace = server.of('/caps');
const Queue = require('./lib/queue');
const orderQueue = new Queue();

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


//VENDOR EVENTS
  socket.on('pickup', (payload) => {
    console.log('EVENT:', { event: 'pickup', payload });
    // DONE: step ONE.  store all messages in queue
    // let driverQueue = orderQueue.read('driver', payload.store);
    // this is a variable called driverQueue that is a reference to the queue that is stored in the orderQueue object
    let driverQueue = orderQueue.read(payload.queueId);
    // first time we run our server, this queue won't exist.  we need validation
    if(!driverQueue){
      // let driverKey = orderQueue.store('driver', payload.store, new Queue);

      //this is the variable called driverKey
      // driverKey takes the value of the key that is returned from the store method
      //'driver' is the key that we are storing
      // new Queue is the value that we are storing
      // orderQueue is the object that we are storing the key/value pair in
      // .store is the method that we are using to store the key/value pair
      let driverKey = orderQueue.store(payload.queueId,  new Queue);
      // driverQueue is the variable that we are assigning the value of the key that we just stored
      // orderQueue is the object that we are reading the key/value pair from
      // .read is the method that we are using to read the key/value pair
      // driverKey is the key that we are reading
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
    let currentQueue = orderQueue.read(payload.queueId);
    if(!currentQueue) {
      throw new Error('we have messages but no queue!');
    }
    let message = currentQueue.remove(payload.orderId);
    capsNamespace.emit('received', message);
  });

//get all messages from queue
  //TODO: Step THREE.  create an event called GET-MESSAGES, that the recipient can emit so that they can obtain any missed messages
  socket.on('getAll', (payload) => {
    console.log('attempting to get all messages');
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
