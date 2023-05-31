const eventPool = require('./eventPool');

eventPool.onAny((event, payload) => {
  console.log('EVENT:', {
    event,
    time: new Date().toISOString(),
    payload,
  });
});
