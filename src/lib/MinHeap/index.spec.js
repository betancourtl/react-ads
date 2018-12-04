import Heap from './';

describe('Heap', () => {

  describe('swap', () => {
    it('Should swap values.', () => {
      const h = new Heap();
      const arr = [1, 2, 3, 4];
      h.swap(arr, 0, 1);
      expect(arr).to.deep.equal([2, 1, 3, 4]);
    });
  });

  describe('size', () => {
    it('Should return the size.', () => {
      const h = new Heap();
      h.insert(10);
      h.insert(5);
      h.insert(8);
      h.insert(4);
      expect(h.size).to.equal(4);
    });
  });

  describe('isEmpty', () => {
    it('Should return true.', () => {
      const h = new Heap();
      expect(h.isEmpty).to.equal(true);
    });
  });

  describe('min', () => {
    it('Should return the minimum number.', () => {
      const h = new Heap();
      h.insert(10);
      h.insert(5);
      h.insert(8);
      h.insert(4);
      expect(h.min).to.equal(4);
    });
  });

  describe('insert', () => {
    it('Should insert into the heap.', () => {
      const h = new Heap();
      h.insert(10);
      h.insert(5);
      h.insert(8);
      h.insert(4);
      expect(h.min).to.equal(4);
      expect(h.heap).to.deep.equal([4, 5, 8, 10]);
    });
    it('Should insert the same numbers into the heap.', () => {
      const h = new Heap();
      h.insert(10);
      h.insert(4);
      h.insert(5);
      h.insert(8);
      h.insert(4);

      expect(h.min).to.equal(4);
      expect(h.heap).to.deep.equal([4, 4, 5, 10, 8]);
      h.extract();
      expect(h.heap).to.deep.equal([4, 8, 5, 10]);
      h.extract();
      expect(h.heap).to.deep.equal([5, 8, 10]);
      h.extract();
      expect(h.heap).to.deep.equal([8, 10]);
      h.extract();
      expect(h.heap).to.deep.equal([10]);
      h.extract();
      expect(h.heap).to.deep.equal([]);
    });
  });
});
