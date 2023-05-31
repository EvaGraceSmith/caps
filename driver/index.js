const { handlePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');

eventPool.on('pickup', handlePickup);
eventPool.on('delivered', handleDelivered);
