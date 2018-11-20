import Queue from './';

describe('Queue', () => {
  describe('size', () => {
    it('size', () => {
      const q = new Queue();
      q.enqueue({ name: 'Luis' });
      q.enqueue({ name: 'Luis' });
      expect(q.size).to.equal(2);
    });
  });

  describe('isEmpty', () => {
    it('should return true', () => {
      const q = new Queue();
      expect(q.isEmpty).to.equal(true);
    });

    it('should return false', () => {
      const q = new Queue();
      q.enqueue({ name: 'Luis' });
      expect(q.isEmpty).to.equal(false);
    });
  });

  describe('enqueue', () => {
    it('should add an item to the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.items[0]).to.equal('Luis');
      expect(q.items[1]).to.equal('Javier');
      expect(q.items[2]).to.equal('Betancourt');
    });
  });

  describe('dequeue', () => {
    it('should remove an item to the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      const item1 = q.dequeue();
      expect(item1).to.equal('Luis');
      expect(q.lowestCount).to.deep.equal(1);
      expect(q.count).to.deep.equal(3);
      const item2 = q.dequeue();
      expect(item2).to.equal('Javier');
      expect(q.lowestCount).to.deep.equal(2);
      expect(q.count).to.deep.equal(3);
      const item3 = q.dequeue();
      expect(item3).to.equal('Betancourt');
      const item4 = q.dequeue();
      expect(q.lowestCount).to.deep.equal(3);
      expect(q.count).to.deep.equal(3);
      expect(item4).to.equal(undefined);
    });
  });

  describe('clear', () => {
    it('should clear the queue', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      q.clear();
      expect(q.items).to.deep.equal({});
      expect(q.lowestCount).to.deep.equal(0);
      expect(q.count).to.deep.equal(0);
    });
  });

  describe('peek', () => {
    it('should return the next value', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.peek()).to.equal('Luis');
    });
  });

  describe('toString', () => {
    it('should return a string', () => {
      const q = new Queue();
      q.enqueue('Luis');
      q.enqueue('Javier');
      q.enqueue('Betancourt');
      expect(q.toString()).to.equal('Luis, Javier, Betancourt');
    });
  });
});
