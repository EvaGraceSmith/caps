'use strict';

const eventPool = require('../eventPool');


function handlePickup(payload) {
  console.log(`DRIVER: picked up ${payload.orderId}`);

  eventPool.emit('in-transit', payload);
}

function handleDelivered(payload) {
  console.log(`DRIVER: delivered ${payload.orderId}`);

  eventPool.emit('delivered', payload);
}

const handlePickupAndDelivery = (payload) => {
  setTimeout(() => {
    handlePickup(payload);
  }, 1000);
  setTimeout(() => {
    handleDelivered(payload);
  }, 2000);
};

module.exports = { handlePickup, handleDelivered, handlePickupAndDelivery };
