class Queue {
  constructor() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0
  }

  get size() {
    return this.count - this.lowestCount;
  };

  get isEmpty() {
    return this.size === 0;
  };

  enqueue = (items = []) => {
    []
      .concat(items)
      .forEach(item => {
        this.items[this.count] = item;
        this.count++;
      });
      return this;
  };

  dequeue = () => {
    if (this.isEmpty) return;
    const item = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return item;
  };

  clear = () => {
    this.items = {};
    this.lowestCount = 0;
    this.count = 0;
  };

  peek = () => {
    if (this.isEmpty) return undefined;
    return this.items[this.lowestCount];
  };

  toString = () => {
    if (this.isEmpty) return '';

    return Object
      .keys(this.items)
      .map(x => this.items[x])
      .join(', ')
  };
}

export default Queue;
