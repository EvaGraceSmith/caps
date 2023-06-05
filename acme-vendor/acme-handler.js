const eventPool = require('../eventPool');


function simulatePickup(store, orderId, customer, address) {
  const order = {
    store: store,
    queueId: 'acme-widgets',
    orderId: orderId,
    customer: customer,
    address: address,
  };

  eventPool.emit('pickup', order);
}

function handleDelivered(orderId) {
  console.log(`acme-widgets: Thank you for delivering ${orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
