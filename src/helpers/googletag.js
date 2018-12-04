/**
 * @module googletag
 */

/**
 * Will create the google tag scripts and load the googletag library.
 *
 * @function
 * @returns {void}
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
 * Will create the googleTag queue for handling asynchronous calls.
 *
 * @function
 * @returns {void}
 */
export const startGoogleTagQue = () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
};

/**
 * Will enable singleRequests so that multiple ads can be fetched from a single
 * HTTP request.
 *
 * @function
 * @param {bool} enabled
 * @returns {void}
 */
export const enableSingleRequest = enabled => {
  if (!enabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

/**
 * Will stop the initial ad load.
 *
 * @function
 * @param {bool} disabled
 */
export const disableInitialLoad = (disabled) => {
  if (!disabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().disableInitialLoad();
  });
};

/**
 * Will enable lazy loading ads.
 *
 * @function
 * @param {bool|object} props
 * @returns {void}
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
 *
 * @function
 * @param {bool} isCentered
 * @returns {void}
 */
export const setCentering = (isCentered = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setCentering(isCentered);
  });
};

/**
 * Will enable Async rendering. By default this is true, Only use this
 * to override a previous setting.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */
export const enableAsyncRendering = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableAsyncRendering(isEnabled);
  });
};

/**
 * Will enable Synchronous rendering of ads.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */
export const enableSyncRendering = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSyncRendering(isEnabled);
  });
};

/**
 * Will enable enable video ads.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */
export const enableVideoAds = (isEnabled = false) => {
  if (!isEnabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableVideoAds();
  });
};

/**
 * Will collapse empty divs. Enabling this might cause issues with SRA.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */
export const collapseEmptyDivs = (isEnabled = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().collapseEmptyDivs(isEnabled);
  });
};

/**
 * Will get the googletag version.
 *
 * @function
 * @returns {void}
 */
export const getVersion = () => {
  window.googletag.cmd.push(() => {
    window.googletag.getVersion();
  });
};

/**
 * Will enable googletag services.
 *
 * @function
 * @returns {void}
 */
export const enableServices = () => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().set('adsense_background_color', '#000000');
    window.googletag.pubads().set('adsense_border_color', '#000000');
    window.googletag.enableServices();
  });
};

/**
 * Will monkey patch the global googletag functions so that we can subscribe to
 * Whenever the function is called.
 *
 * @function
 * @param {callback} pubSub - PubSub instance used to emit events.
 * @returns {void}
 */
export const createGoogleTagEvents = (pubSub, log = false) => {
  window.googletag.cmd.push(() => {

    // Pass this outside the function. There is no need to know about the inner
    // workings of the pubSub.
    const callback = (evtName, result) => {
      if (log) console.log('fired ', evtName);
      pubSub.emit(evtName, result);
    };

    const fns = [
      {
        ref: window.googletag,
        events: [
          'defineSlot',
          'destroySlots',
          'display',
        ],
      },
      {
        ref: window.googletag.pubads(),
        events: [
          'disableInitialLoad',
          'enableAsyncRendering',
          'enableSyncRendering',
          'enableLazyLoad',
          'enableSingleRequest',
          'enableVideoAds',
          'setCentering',
          'collapseEmptyDivs',
          'getVersion',
          'refresh',
          'enableServices',
        ],
      },
    ];

    const monkeyPatch = (obj, fnName, cb) => {
      const fn = obj[fnName];
      obj[fnName] = function () {
        const result = fn.apply(this, arguments);
        cb(fnName, result);
        return result;
      };
    };

    fns
      .forEach(({ ref, events }) => {
        events.forEach(evt => monkeyPatch(ref, evt, callback));
      });
  });
};
