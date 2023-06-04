const eventPool = require('../eventPool');
const Chance = require('chance');
const { simulatePickup, handleDelivered } = require('../yourModule'); // Replace 'yourModule' with the actual file name

jest.mock('../eventPool'); // Mock the eventPool module

describe('simulatePickup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should emit the "pickup" event with the provided payload', () => {
    const payload = {
      store: '1-206-flowers',
      orderId: '123',
      customer: 'John Doe',
      address: '123 Main St',
    };
    const emitSpy = jest.spyOn(eventPool, 'emit');

    simulatePickup(payload);

    expect(emitSpy).toHaveBeenCalledWith('pickup', payload);
  });

  it('should generate a random payload and emit the "pickup" event if no payload is provided', () => {
    const generateSpy = jest.spyOn(chance, 'guid').mockReturnValue('456');
    jest.spyOn(chance, 'name').mockReturnValue('Jane Smith');
    jest.spyOn(chance, 'address').mockReturnValue('456 Elm St');
    const emitSpy = jest.spyOn(eventPool, 'emit');

    simulatePickup();

    expect(generateSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('pickup', {
      store: '1-206-flowers',
      orderId: '456',
      customer: 'Jane Smith',
      address: '456 Elm St',
    });

    generateSpy.mockRestore();
  });
});

describe('handleDelivered', () => {
  it('should log the correct message to the console', () => {
    const payload = {
      orderId: '123',
    };
    const consoleLogSpy = jest.spyOn(console, 'log');

    handleDelivered(payload);

    expect(consoleLogSpy).toHaveBeenCalledWith(`VENDOR: Thank you for delivering ${payload.orderId}`);

    consoleLogSpy.mockRestore();
  });
});
