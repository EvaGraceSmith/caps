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
    const orderId = '9e8fdd8e-719a-5b50-8b8d-addf8d0c259d'; // Replace with your non-regex order ID
    const address= '';

        // Mock the emit function in the eventPool module
        eventPool.emit = jest.fn();

    simulatePickup(storeName);

    expect(eventPool.emit).toHaveBeenCalledWith('pickup', expect.objectContaining({
      store: storeName,
      orderId: expect.any(String),
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

