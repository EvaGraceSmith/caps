const { simulatePickup, handleDelivered } = require('./handler');

const eventPool = require('../eventPool');

const Chance = require('chance');

const chance = new Chance();

// Mock console.log to capture the output
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
//spy on eventPool.emit
jest.spyOn(eventPool, 'emit');

describe('Vendor Event Handlers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('simulatePickup should emit pickup event with the correct payload', () => {
    const storeName = '1-206-flowers';
    orderId = chance.guid(),
    customer = chance.name(),
    address = chance.address(),



    simulatePickup(storeName, orderId, customer, address);

    expect(eventPool.emit).toHaveBeenCalledWith('pickup', expect.objectContaining({
      store: storeName,
      orderId: orderId,
      customer: customer,
      address: address,
    }));
  });

  test('handleDelivered should log the correct message', () => {
    const orderId = 'e3669048-7313-427b-b6cc-74010ca1f8f0';
    const expectedMessage = `VENDOR: Thank you for delivering ${orderId}`;

    handleDelivered(orderId);

    expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
  });
});
