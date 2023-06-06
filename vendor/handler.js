'use strict'

const { Chance } = require('chance');
const chance = new Chance();
let orderNumber = 1;
const store = '1-206-flowers';


function simulatePickup(capsSocket) {
  const order = {
    store: store,
    queueId: store,
    orderId: orderNumber++,
    customer: chance.name(),
    address: chance.address(),
  };
  console.log(`${order.customer} ordering ${order.orderId}`);
  capsSocket.emit('pickup', order);
}

function handleDelivered(capsSocket, payload) {
  console.log(`Thank you ${payload.customer} for your order ${payload.orderId}`);
  payload.queueId = payload.store;
  capsSocket.emit('received', payload);
}

module.exports = { simulatePickup, handleDelivered, store };
