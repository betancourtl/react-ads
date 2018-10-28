/**
 * Pubsub - This is used to notify when monkey patched functions are called.
 * In the goolgetag library.
 * @class
 */
class PubSub {
  constructor() {
    this.state = {
      events: {},
    };
  }

  /**
   * This callback is a function that can be passed to the PubSub event emitter.
   * @callback eventCallback
   * @param {*}
   */

  /**
   * Will subscribe to an event, so that when the emit method is called. The
   * callback function can be called.
   * @function
   * @param eventName {string} - The event name that we want to subscript to.
   * @param eventCallback {function} - The function that we want to call when an event happens.
   */
  on = (eventName = '', eventCallback) => {
    const events = this.state.events[eventName];

    if (!events) {
      this.state.events[eventName] = [eventCallback];
    } else {
      this.state.events[eventName].push(eventCallback);
    }
  };

  clear = () => {
    this.state.events = {};
  };

  /**
   * Will emit an action and then call the functions that are subscribed to
   * the event.
   * @function
   * @param eventName {string} - The event that we want to emit.
   * @param props {*} - parameters to pass to the callback.
   */
  emit = (eventName = '', ...props) => {
    const event = this.state.events[eventName];
    if (!event) return;
    event.forEach(fn => fn(...props));
  };
}

export default PubSub;
