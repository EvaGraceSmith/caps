const eventPool = require('../eventPool');
const Chance = require('chance');

const chance = new Chance();

function simulatePickup(store) {
  const order = {
    store,
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };

  eventPool.emit('pickup', order);
}

function handleDelivered(orderId) {
  console.log(`VENDOR: Thank you for delivering ${orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
