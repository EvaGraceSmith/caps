const eventPool = require('../eventPool');

function handlePickup(orderId) {
  console.log(`DRIVER: picked up ${orderId}`);
  const payload = {
    store: '1-206-flowers',
    queueId: 'driver',
    orderId,
    customer: 'Jamal Braun',
    address: 'Schmittfort, LA',
  };
  eventPool.emit('in-transit', payload);
}

function handleDelivered(orderId) {
  console.log(`DRIVER: delivered ${orderId}`);
  const payload = {
    store: '1-206-flowers',
    orderId,
    customer: 'Jamal Braun',
    address: 'Schmittfort, LA',
  };
  eventPool.emit('delivered', payload);
}

module.exports = { handlePickup, handleDelivered };
