const eventPool = require('../eventPool');
const { handlePickupAndDelivery } = require('./handler.js'); // Replace 'yourModule' with the actual file name

jest.mock('../eventPool'); // Mock the eventPool module

describe('handlePickupAndDelivery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call handlePickup and handleDelivered with the correct payload', () => {
    const payload = { orderId: '123' };
    const handlePickupSpy = jest.spyOn(handlePickupAndDelivery, 'handlePickup');
    const handleDeliveredSpy = jest.spyOn(handlePickupAndDelivery, 'handleDelivered');

    handlePickupAndDelivery(payload);

    expect(handlePickupSpy).toHaveBeenCalledWith(payload);
    expect(handleDeliveredSpy).toHaveBeenCalledWith(payload);
  });

  it('should emit "in-transit" event with the correct payload after 1 second', () => {
    const payload = { orderId: '123' };
    jest.useFakeTimers();

    handlePickupAndDelivery(payload);

    jest.advanceTimersByTime(1000);
    expect(eventPool.emit).toHaveBeenCalledWith('in-transit', payload);

    jest.useRealTimers();
  });

  it('should emit "delivered" event with the correct payload after 2 seconds', () => {
    const payload = { orderId: '123' };
    jest.useFakeTimers();

    handlePickupAndDelivery(payload);

    jest.advanceTimersByTime(2000);
    expect(eventPool.emit).toHaveBeenCalledWith('delivered', payload);

    jest.useRealTimers();
  });
});
