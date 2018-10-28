/**
 * @module googletag
 */

/**
 * Will create the google tag scripts and load the googletag
 * library.
 * @function
 */
export const createGPTScript = () => {
  const id = 'react-ads-google-tag-script';
  const scriptExists = document.getElementById(id);

  if (scriptExists) {
    console.log('google tag script already exists');
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};

/**
 * Will create the googleTag que for handling asynchronous
 * googletag function calls.
 * @function
 */
export const startGoogleTagQue = () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
};

/**
 * Will enable singleRequests so that multiple ads can be fetched from a single
 * HTTP request.
 * @function
 * @param enabled {bool}
 */
export const enableSingleRequest = (enabled) => {
  if (!enabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

/**
 * Will stop the initial ad load.
 * @function
 * @param disabled {bool}
 */
export const disableInitialLoad = (disabled) => {
  if (disabled)
    window.googletag.cmd.push(() => {
      window.googletag.pubads().disableInitialLoad();
    });
};

/**
 * Will enable lazy loading ads. Be aware that lazy loading and SRA will not
 * work properly when both are enabled. Enabling SRA and lazy load will only lazy
 * load the initial ads and then it will fetch the rest of the other ads whenever
 * the ad meets the lazy lading requirements.
 * HTTP request.
 * @function
 * @param isEnabled {bool}
 */
export const enableLazyLoad = (isEnabled = true) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableLazyLoad(isEnabled);
  });
};

/**
 * Will center the ads automatically.
 * @function
 * @param isCentered {bool}
 */
export const setCentering = (isCentered = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setCentering(isCentered);
  });
};

/**
 * Will monkey patch the global googletag functions so that we can subscribe to
 * Whenever the function is called.
 * @function
 * @param pubSub {object} - PubSub instance used to emit events.
 */
export const createGoogleTagEvents = pubSub => {

  // Listen to the defineSlot function when it is called
  window.googletag.cmd.push(() => {
    const defineSlot = window.googletag.defineSlot;
    window.googletag.defineSlot = function () {
      const slot = defineSlot.apply(this, arguments);
      pubSub.emit('defineSlot', slot);
      return slot;
    };
  });

  // Listen to the refresh function when it is called
  window.googletag.cmd.push(() => {
    const refresh = window.googletag.pubads().refresh;
    window.googletag.pubads().refresh = function () {
      refresh.apply(this, arguments);
      pubSub.emit('refresh');
    };
  });

  // Listen to the destroySlots function when it is called
  window.googletag.cmd.push(() => {
    const destroySlots = window.googletag.destroySlots;
    window.googletag.destroySlots = function () {
      destroySlots.apply(this, arguments);
      pubSub.emit('destroySlots');
    };
  });
};
