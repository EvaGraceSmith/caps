const { handlePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');

// Mock console.log to capture the output
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

//spy on eventPool.emit
jest.spyOn(eventPool, 'emit');

describe('Driver Event Handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handlePickup should log the correct message and emit in-transit event', () => {
    const orderId = 'e3669048-7313-427b-b6cc-74010ca1f8f0';
    const expectedPickupMessage = `DRIVER: picked up ${orderId}`;
    const expectedInTransitEventPayload = {
      store: '1-206-flowers',
      queueId: 'driver',
      orderId,
      customer: 'Jamal Braun',
      address: 'Schmittfort, LA',
    };

    handlePickup(orderId);

    expect(consoleLogSpy).toHaveBeenCalledWith(expectedPickupMessage);
    expect(eventPool.emit).toHaveBeenCalledWith('in-transit', expectedInTransitEventPayload);
  });

  test('handleDelivered should log the correct message and emit delivered event', () => {
    const orderId = 'e3669048-7313-427b-b6cc-74010ca1f8f0';
    const expectedDeliveredMessage = `DRIVER: delivered ${orderId}`;
    const expectedDeliveredEventPayload = {
      store: '1-206-flowers',
      orderId,
      customer: 'Jamal Braun',
      address: 'Schmittfort, LA',
    };

    handleDelivered(orderId);

    expect(consoleLogSpy).toHaveBeenCalledWith(expectedDeliveredMessage);
    expect(eventPool.emit).toHaveBeenCalledWith('delivered', expectedDeliveredEventPayload);
  });
});
