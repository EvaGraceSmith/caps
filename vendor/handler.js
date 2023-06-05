const eventPool = require('../eventPool');


function simulatePickup(store, orderId, customer, address) {
  const order = {
    store: store,
    queueId: '1-206-flowers',
    orderId: orderId,
    customer: customer,
    address: address,
  };

  eventPool.emit('pickup', order);
}

function handleDelivered(orderId) {
  console.log(`1-206-flowers: Thank you for delivering ${orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
