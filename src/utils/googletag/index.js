/**
 * @module googletag
 */

export const events = {
  slotOnload: 'slotOnload',
  slotRenderEnded: 'slotRenderEnded',
  impressionViewable: 'impressionViewable',
  slotVisibilityChanged: 'slotVisibilityChanged',
};

export const getWindowWidth = () => window.innerWidth;

/**
 * Pushes a function to the googletag queue. 
 * @param {cb}
 * @returns {void}
 */
export const cmdPush = cb => window.googletag.cmd.push(cb);

export const setAdIframeTitle = title => {
  if (!title) return;
  cmdPush(() => window.googletag.setAdIframeTitle(title));
};

/**
 * Destroys google slots.
 * @param {Slot[]} - Array of slots to destroy.
 * @returns {void}
 */
export const destroySlots = slots => {
  cmdPush(() => window.googletag.destroySlots(slots));
};

/**
 * 
 * @param {Slot[]} Slot - Array of google slots.
 */
export const refresh = slots => {
  cmdPush(() => window.googletag.pubads().refresh(slots));
};

/**
 * Add the pubads service to the slot.
 * @param {Boolean} outOfPageSlot
 * @param {String} adUnitPath
 * @param {Array | Array[Array[Number]] | String } mapSize
 * @param {String} id
 * @returns {void}
 */
export const define = (outOfPageSlot, adUnitPath, mapSize, id) => {
  return outOfPageSlot
    ? window.googletag
      .defineOutOfPageSlot(adUnitPath, id)
      .addService(window.googletag.pubads())
    : window.googletag
      .defineSlot(adUnitPath, mapSize, id)
      .addService(window.googletag.pubads());
};

/**
 * Will destroy the googletag slot.
 * @param {Slot} slot
 * @returns {void}
 */
export const destroyAd = slot => {
  cmdPush(() => window.googletag.destroySlots([slot]));
};

/**
 * Creates a new SizeMappingBuilder. 
 * @function
 * @returns {SizeMappingBuilder}
 */
export const sizeMapping = () => window.googletag.sizeMapping();

/**
 * Will create the google tag scripts and load the googletag library.
 * @function
 * @param {Event} e - Event object.
 * @param {Function} cb - Function used to handle the event.
 * @returns {void}
 */
export const addEventListener = (e, cb) => {
  return window.googletag.pubads().addEventListener(e, cb);
};

/**
 * Will create the google tag scripts and load the googletag library.
 * @function
 * @returns {void}
 */
export const createGPTScript = () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  const id = 'react-ads-google-tag-script';
  const scriptExists = document.getElementById(id);

  if (scriptExists) {
    // eslint-disable-next-line no-console
    console.error('google tag script already exists');
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};

/**
 * Will enable singleRequests so that multiple ads can be fetched from a single
 * HTTP request.
 * @function
 * @param {Boolean} enabled
 * @returns {void}
 */
export const enableSingleRequest = enabled => {
  if (!enabled) return;
  cmdPush(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

/**
 * Will prevent the googletag.display fn from fetching all the ad when called.
 * @function
 * @param {Boolean} disabled - Will stop the initial ad load.
 */
export const disableInitialLoad = (disabled) => {
  if (!disabled) return;
  cmdPush(() => {
    window.googletag.pubads().disableInitialLoad();
  });
};

/**
 * Will center the ads automatically.
 * @function
 * @param {Boolean} isCentered
 * @returns {void}
 */
export const setCentering = (isCentered = false) => {
  cmdPush(() => {
    window.googletag.pubads().setCentering(isCentered);
  });
};

/**
 * Will enable Async rendering. By default this is true, only use this
 * to override a previous setting.
 * @function
 * @param {Boolean} isEnabled
 * @returns {void}
 */
export const enableAsyncRendering = (isEnabled = false) => {
  if (!isEnabled) return;
  cmdPush(() => {
    window.googletag.pubads().enableAsyncRendering(isEnabled);
  });
};

/**
 * Will enable video ads.
 * @function
 * @param {Boolean} isEnabled
 * @returns {void}
 */
export const enableVideoAds = (isEnabled = false) => {
  if (!isEnabled) return;
  cmdPush(() => {
    window.googletag.pubads().enableVideoAds();
  });
};

/**
 * Will collapse empty divs. Enabling this might cause issues with SRA.
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */
export const collapseEmptyDivs = (isEnabled = false) => {
  cmdPush(() => {
    window.googletag.pubads().collapseEmptyDivs(isEnabled);
  });
};

/**
 * Will get the googletag version.
 * @function
 * @returns {void}
 */
export const getVersion = () => {
  cmdPush(() => {
    window.googletag.getVersion();
  });
};

/**
 * Will fetch the google ad from DFP. When SRA is enabled this will
 * fetch ALL the ads that called the defineSlot function, but have
 * not been displayed.
 * @param {String|Slot} id - The slotElementId or the Slot Object.
 */
export const display = id => {
  cmdPush(() => {
    window.googletag.display(id);
  });
};

/**
 * Will enable googletag services.
 * @function
 * @returns {void}
 */
export const enableServices = () => {
  cmdPush(() => {
    window.googletag.enableServices();
  });
};

/**
 * Will set page level targeting for all slots.
 * @function
 * @returns {void}
 */
export const setTargeting = (targeting = {}) => {
  cmdPush(() => {
    Object
      .entries(targeting)
      .map(([k, v]) => window.googletag.pubads().setTargeting(k, v));
  });
};
