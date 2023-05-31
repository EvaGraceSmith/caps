const { simulatePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');

eventPool.on('delivered', handleDelivered);

// Simulate pickup for a store
simulatePickup('1-206-flowers');
