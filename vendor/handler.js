'use strict'

const eventPool = require('../eventPool');
let Chance = require('chance');

let chance = new Chance();

const simulatePickup = (payload=null) => {
  if (!payload) {
  payload = {
    store: '1-206-flowers',
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };
  }
  console.log(`VENDOR: Order ${payload.orderId} has been received`);
  eventPool.emit('pickup', payload);
}

function handleDelivered(payload) {
  console.log(`VENDOR: Thank you for delivering ${payload.orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
