const eventPool = require('./eventPool');

// This is a global event listener, that is logging all events
eventPool.onAny((event, payload) => {
  console.log('EVENT:', {
    event,
    time: new Date().toISOString(),
    payload,
  });
});
