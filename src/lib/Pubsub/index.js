/**
 * Pubsub - This is used to notify when monkey patched functions are called.
 * In the goolgetag library.
 * @class
 */
class PubSub {
  constructor() {
    this.events = {};
  }

  /**
 * Will emit an action and then call the functions that are subscribed to
 * the event.
 * @function
 * @param {String} name - The event that we want to emit.
 * @param {*} props - parameters to pass to the callback.
 * @returns {void}
 */
  emit = (name, ...props) => {
    if (this.events[name]) this.events[name].forEach(fn => fn(...props));
  };

  /**
   * Will subscribe to an event, so that when the emit method is called. The
   * callback function can be called.
   * @function
   * @param {String} name - The event name that we want to subscript to.
   * @param {Function} handler - The function that we want to call when an event happens.
   * @returns {void}
   */
  on = (name, handler) => {
    if (!this.events[name]) this.events[name] = [];
    this.events[name].push(handler);
  };

  /**
   * Will unsubscribe a handler from the events.
   * @function
   * @param {String} name - The event name that we want to unsubscribe freom.
   * @param {Function} handler - The function to remove from the event.
   * @returns {void}
   */
  off = (name, handler) => {
    if (this.events[name]) this
      .events[name]
      .splice(this.events[name].indexOf(handler));
  };

  /**
   * Will clreat all of the events.
   * @returns {void}
   */
  clear = () => {
    this.events = {};
  };
}

export default PubSub;
