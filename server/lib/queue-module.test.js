const Queue = require('./queue');

describe('Queue', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue();
  });

  test('should store a key-value pair in the queue', () => {
    const key = 'key';
    const value = 'value';
    const consoleLogSpy = jest.spyOn(console, 'log');

    const storedKey = queue.store(key, value);

    expect(queue.data[key]).toBe(value);
    expect(consoleLogSpy).toHaveBeenCalledWith('something was added to the queue');
    expect(storedKey).toBe(key);

    consoleLogSpy.mockRestore();
  });

  test('should read a value from the queue using the key', () => {
    const key = 'key';
    const value = 'value';
    queue.store(key, value);

    const retrievedValue = queue.read(key);

    expect(retrievedValue).toBe(value);
  });

  test('should remove a value from the queue using the key', () => {
    const key = 'key';
    const value = 'value';
    queue.store(key, value);
    const consoleLogSpy = jest.spyOn(console, 'log');

    const removedValue = queue.remove(key);

    expect(queue.data[key]).toBeUndefined();
    expect(consoleLogSpy).toHaveBeenCalledWith('something was removed from the queue');
    expect(removedValue).toBe(value);

    consoleLogSpy.mockRestore();
  });
});
