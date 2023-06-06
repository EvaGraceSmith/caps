const { simulatePickup, handleDelivered, store } = require('./handler');

describe('simulatePickup', () => {
  let capsSocket;

  beforeEach(() => {
    capsSocket = {
      emit: jest.fn(),
    };
  });

  test('should emit "pickup" event with correct order data', () => {
    simulatePickup(capsSocket);

    expect(capsSocket.emit).toHaveBeenCalledWith('pickup', expect.objectContaining({
      store: store,
      queueId: store,
      orderId: expect.any(Number),
      customer: expect.any(String),
      address: expect.any(String),
    }));
  });
});

describe('handleDelivered', () => {
  let capsSocket;

  beforeEach(() => {
    capsSocket = {
      emit: jest.fn(),
    };
  });

  test('should emit "received" event with updated queueId', () => {
    const payload = {
      store: store,
      customer: 'John Doe',
      orderId: 123,
    };

    handleDelivered(capsSocket, payload);

    expect(capsSocket.emit).toHaveBeenCalledWith('received', expect.objectContaining({
      store: store,
      queueId: store,
      customer: payload.customer,
      orderId: payload.orderId,
    }));
  });
});

