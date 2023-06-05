'use strict';

const { handlePickupAndDelivery} = require('./handler');
const eventPool = require('../eventPool');


eventPool.on('pickup', handlePickupAndDelivery);
