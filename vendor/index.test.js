const io = require('socket.io-client');
const server = require('../index');

describe('CAPS Vendor', () => {
  let socket;
  beforeAll(() => {
    // Set up a mock socket.io socket
    const socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };

    // Mock the socket.io library
    jest.mock('socket.io', () => ({
      __esModule: true,
      default: jest.fn().mockReturnValue(socket),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore the original console.log implementation
    consoleLogSpy.mockRestore();
  });

  test('should receive delivery confirmation when an order is delivered', (done) => {
    socket.on('delivered', (payload) => {
      expect(payload).toBeDefined();
      expect(payload.customer).toBe('John Smith');
      done();
    });

    const order = {
      store: '1-206-flowers',
      orderId: 12345,
      customer: 'John Smith',
      address: 'Seattle, WA',
    };

    socket.emit('pickup', order);
    socket.emit('in-transit', order);
    socket.emit('delivered', order);
  });
});
