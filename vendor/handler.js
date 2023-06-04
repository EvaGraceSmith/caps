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

//add a payload to the emit
// let payload = {
//     event: 'pickup',
//     messageId: order.id,
//     queueId:

function handleDelivered(orderId) {
  console.log(`VENDOR: Thank you for delivering ${orderId}`);
}

module.exports = { simulatePickup, handleDelivered };
