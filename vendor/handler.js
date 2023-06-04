const eventPool = require('../eventPool');


function simulatePickup(store, orderId, customer, address) {
  const order = {
    store: store,
    queueId: 'vendor',
    orderId: orderId,
    customer: customer,
    address: address,
  };

  eventPool.emit('pickup', order);
}

function handleDelivered(orderId) {
  console.log(`VENDOR: Thank you for delivering ${orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
