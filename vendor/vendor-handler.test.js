const { simulatePickup, handleDelivered } = require('./handler');
const eventPool = require('../eventPool');

// Mock console.log to capture the output
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

describe('Vendor Event Handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('simulatePickup should emit pickup event with the correct payload', () => {
    const storeName = '1-206-flowers';
    const orderIdRegex = /[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[89ab][a-z0-9]{3}-[a-z0-9]{12}/i;

    simulatePickup(storeName);

    expect(eventPool.emit).toHaveBeenCalledWith('pickup', expect.objectContaining({
      store: storeName,
      orderId: expect.stringMatching(orderIdRegex),
      customer: expect.any(String),
      address: expect.any(String),
    }));
  });

  test('handleDelivered should log the correct message', () => {
    const orderId = 'e3669048-7313-427b-b6cc-74010ca1f8f0';
    const expectedMessage = `VENDOR: Thank you for delivering ${orderId}`;

    handleDelivered(orderId);

    expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
  });
});
