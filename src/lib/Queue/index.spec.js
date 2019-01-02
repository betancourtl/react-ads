import Queue from './';

describe('Queue', () => {
  describe('size', () => {
    test('size', () => {
      const q = new Queue();
      q.enqueue({ name: 'Luis' });
      q.enqueue({ name: 'Luis' });
      expect(q.size).toEqual(2);
    });
  });

  describe('isEmpty', () => {
    test('should return true', () => {
      const q = new Queue();
      expect(q.isEmpty).toEqual(true);
    });

    test('should return false', () => {
      const q = new Queue();
      q.enqueue({ name: 'Luis' });
      expect(q.isEmpty).toEqual(false);
    });
  });

  describe('enqueue', () => {
    test('should add an item to the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.items[0]).toEqual('Luis');
      expect(q.items[1]).toEqual('Javier');
      expect(q.items[2]).toEqual('Betancourt');
    });
  });

  describe('dequeue', () => {
    test('should remove an item to the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      const item1 = q.dequeue();
      expect(item1).toEqual('Luis');
      expect(q.lowestCount).toEqual(1);
      expect(q.count).toEqual(3);
      const item2 = q.dequeue();
      expect(item2).toEqual('Javier');
      expect(q.lowestCount).toEqual(2);
      expect(q.count).toEqual(3);
      const item3 = q.dequeue();
      expect(item3).toEqual('Betancourt');
      const item4 = q.dequeue();
      expect(q.lowestCount).toEqual(3);
      expect(q.count).toEqual(3);
      expect(item4).toEqual(undefined);
    });
  });

  describe('clear', () => {
    test('should clear the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      q.clear();
      expect(q.items).toEqual({});
      expect(q.lowestCount).toEqual(0);
      expect(q.count).toEqual(0);
    });
  });

  describe('peek', () => {
    test('should return the next value', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.peek()).toEqual('Luis');
    });
  });

  describe('toString', () => {
    test('should return a string', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.toString()).toEqual('Luis, Javier, Betancourt');
    });
  });
});
