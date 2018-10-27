class PubSub {
  constructor() {
    this.state = {
      events: {},
    };
  }

  on = (eventName, fn) => {
    const events = this.state.events[eventName];

    if (!events) {
      this.state.events[eventName] = [fn];
    } else {
      this.state.events[eventName].push(fn);
    }
  };

  emit = (eventName, ...props) => {
    const event = this.state.events[eventName];
    if (!event) return;
    event.forEach(fn => fn(...props));
  };
}

export default PubSub;
