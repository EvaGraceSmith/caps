const { simulatePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');

eventPool.on('delivered', handleDelivered);

// Simulate pickup for a store

setInterval(() => {
simulatePickup();
}, 5000);


