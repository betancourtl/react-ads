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
 * @param {bool} enabled
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
 * @param {bool} disabled
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
 * @param {bool | object} props
 */
export const enableLazyLoad = (props = true) => {
  if (!props) return;
  window.googletag.cmd.push(() => {
    const value = props === true
      ? {
        fetchMarginPercent: 10,  // Fetch slots within 5 viewports.
        renderMarginPercent: 10,  // Render slots within 2 viewports.
        mobileScaling: 1  // Double the above values on mobile.
      }
      : props;

    window.googletag.pubads().enableLazyLoad(value);
  });
};

/**
 * Will center the ads automatically.
 * @function
 * @param {bool} isCentered
 */
export const setCentering = (isCentered = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setCentering(isCentered);
  });
};

/**
 * Will enable Async rendering. By default this is true, Only use this
 * to override a previous setting.
 * @function
 * @param {bool} isEnabled
 */
export const enableAsyncRendering = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableAsyncRendering(isEnabled);
  });
};

/**
 * Will enable Sync rendering of ads.
 * @function
 * @param {bool} isEnabled
 */
export const enableSyncRendering = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSyncRendering(isEnabled);
  });
};

/**
 * Will enable enable video ads.
 * @function
 * @param {bool} isEnabled
 */
export const enableVideoAds = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableVideoAds();
  });
};

/**
 * Will collapse empty divs..
 * @function
 * @param {bool} isEnabled
 */
export const collapseEmptyDivs = (isEnabled = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().collapseEmptyDivs(isEnabled);
  });
};

/**
 * Will get the googletag version.
 * @function
 */
export const getVersion = () => {
  window.googletag.cmd.push(() => {
    window.googletag.getVersion();
  });
};

/**
 * Will enable googletag services.
 * @function
 */
export const enableServices = () => {
  window.googletag.cmd.push(() => {
    window.googletag.enableServices();
  });
};

/**
 * Will monkey patch the global googletag functions so that we can subscribe to
 * Whenever the function is called.
 * @function
 * @param {object} pubSub - PubSub instance used to emit events.
 */
export const createGoogleTagEvents = pubSub => {

  // Listen to the defineSlot function when it is called.
  window.googletag.cmd.push(() => {
    const defineSlot = window.googletag.defineSlot;
    window.googletag.defineSlot = function () {
      const slot = defineSlot.apply(this, arguments);
      pubSub.emit('defineSlot', slot);
      return slot;
    };
  });

  // Listen to the refresh function when it is called.
  window.googletag.cmd.push(() => {
    const refresh = window.googletag.pubads().refresh;
    window.googletag.pubads().refresh = function () {
      const result = refresh.apply(this, arguments);
      pubSub.emit('refresh');
      return result;
    };
  });

  // Listen to the destroySlots function when it is called.
  window.googletag.cmd.push(() => {
    const destroySlots = window.googletag.destroySlots;
    window.googletag.destroySlots = function () {
      const result = destroySlots.apply(this, arguments);
      pubSub.emit('destroySlots');
      return result;
    };
  });

  // Listen to the disableInitialLoad function when it is called.
  window.googletag.cmd.push(() => {
    const disableInitialLoad = window.googletag.pubads().disableInitialLoad;
    window.googletag.pubads().disableInitialLoad = function () {
      const result = disableInitialLoad.apply(this, arguments);
      pubSub.emit('disableInitialLoad', true);
      return result;
    };
  });

  // Listen to the enableAsyncRendering function when it is called.
  window.googletag.cmd.push(() => {
    const enableAsyncRendering = window.googletag.pubads().enableAsyncRendering;
    window.googletag.pubads().enableAsyncRendering = function () {
      const result = enableAsyncRendering.apply(this, arguments);
      pubSub.emit('enableAsyncRendering', result);
      return result;
    };
  });

  // Listen to the enableAsyncRendering function when it is called.
  window.googletag.cmd.push(() => {
    const enableSyncRendering = window.googletag.pubads().enableSyncRendering;
    window.googletag.pubads().enableSyncRendering = function () {
      const result = enableSyncRendering.apply(this, arguments);
      pubSub.emit('enableSyncRendering', result);
      return result;
    };
  });

  // Listen to the enableLazyLoad function when it is called.
  window.googletag.cmd.push(() => {
    const enableLazyLoad = window.googletag.pubads().enableLazyLoad;
    window.googletag.pubads().enableLazyLoad = function () {
      const result = enableLazyLoad.apply(this, arguments);
      pubSub.emit('enableLazyLoad', true);
      return result;
    };
  });

  // Listen to the enableSingleRequest function when it is called.
  window.googletag.cmd.push(() => {
    const enableSingleRequest = window.googletag.pubads().enableSingleRequest;
    window.googletag.pubads().enableSingleRequest = function () {
      const result = enableSingleRequest.apply(this);
      pubSub.emit('enableSingleRequest', result);
      return result;
    };
  });

  // Listen to the enableVideoAds function when it is called.
  window.googletag.cmd.push(() => {
    const enableVideoAds = window.googletag.pubads().enableVideoAds;
    window.googletag.pubads().enableVideoAds = function () {
      const result = enableVideoAds.apply(this, arguments);
      pubSub.emit('enableVideoAds', true);
      return result;
    };
  });

  // Listen to the setCentering function when it is called.
  window.googletag.cmd.push(() => {
    const setCentering = window.googletag.pubads().setCentering;
    window.googletag.pubads().setCentering = function (...props) {
      const result = setCentering.apply(this, arguments);
      pubSub.emit('setCentering', ...props);
      return result;
    };
  });

  // Listen to the collapseEmptyDivs function when it is called.
  window.googletag.cmd.push(() => {
    const collapseEmptyDivs = window.googletag.pubads().collapseEmptyDivs;
    window.googletag.pubads().collapseEmptyDivs = function (...props) {
      const result = collapseEmptyDivs.apply(this, arguments);
      pubSub.emit('collapseEmptyDivs', ...props);
      return result;
    };
  });

  // Listen to the getVersion function when it is called.
  window.googletag.cmd.push(() => {
    const getVersion = window.googletag.getVersion;
    window.googletag.getVersion = function () {
      const result = getVersion.apply(this, arguments);
      pubSub.emit('getVersion', result);
      return result;
    };
  });

  // Listen to the enableServices function when it is called.
  window.googletag.cmd.push(() => {
    const enableServices = window.googletag.enableServices;
    window.googletag.enableServices = function () {
      const result = enableServices.apply(this, arguments);
      pubSub.emit('enableServices', true);
      return result;
    };
  });
};

