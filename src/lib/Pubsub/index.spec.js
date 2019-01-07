import PubSub from './';

describe('PubSub', () => {
  test('subscribe', () => {
    const p = new PubSub();
    const handler = jest.fn();
    p.on('sayHi', handler);
    expect(p.events.sayHi).toHaveLength(1);
  });

  test('unsubscribe', () => {
    const p = new PubSub();
    const handler = jest.fn();
    p.on('sayHi', handler);
    expect(p.events.sayHi).toHaveLength(1);
    p.off('sayHi', handler);
    expect(p.events.sayHi).toHaveLength(0);
  });

  test('emit', () => {
    const p = new PubSub();
    const handler = jest.fn();
    p.on('sayHi', handler);
    expect(p.events.sayHi).toHaveLength(1);
    p.emit('sayHi', handler);
    expect(handler).toBeCalledTimes(1);
  });

  test('clear', () => {
    const p = new PubSub();
    const handler = jest.fn();
    p.on('sayHi', handler);
    expect(p.events.sayHi).toHaveLength(1);
    p.clear();
    expect(p.events).toEqual({});
  });
});