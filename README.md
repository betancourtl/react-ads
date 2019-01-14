[![Build Status](https://travis-ci.com/webdeveloperpr/react-ads.svg?branch=master)](https://travis-ci.com/webdeveloperpr/react-ads)
# react-gpt-prebid-ads

This package allows you to render ads with DFP and Prebid.

API
- [Provider](#provider)
- [Ad](#ad)

Example
- [Example](#example)
- [Storybook](https://webdeveloperpr.github.io/react-ads)



## Example


`prebid.js`

Create your prebid implementation. You can copy and paste this as a starting 
point.

```javascript
/* eslint-disable no-console */
import Bidder from '../';

const bidder = new Bidder('prebid');

bidder.init = () => {
  if (bidder.isReady) return;
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];

  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = `https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js?${Math.random(1, 10)}`;
    el.async = true;
    el.onload = resolve;
    el.onerror = reject;
    document.head.appendChild(el);
  });
};

bidder.onBidWon = () => { };

bidder.onTimeout = () => { };

/**
 * Will fetch the prebid bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */
bidder.fetchBids = adUnits => new Promise(resolve => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {
    // Set new adUnits
    const adUnitCodes = adUnits.map(x => x.code);
    pbjs.addAdUnits(adUnits);

    // Make the request
    pbjs.requestBids({
      adUnitCodes,
      timeout: bidder.timeout,
      bidsBackHandler: response => {
        resolve({
          response,
          bids: pbjs.getBidResponses(),
          adUnitCodes,
        });
        // remove the adUnits
        adUnitCodes.forEach(adUnitCode => window.pbjs.removeAdUnit(adUnitCode));
      },
    });
  });
});

/**
 * 
 * @function
 * @param {Object} response.adUnitCodes
 * @returns {void}
 */
bidder.handleResponse = ({ adUnitCodes }) => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync(adUnitCodes);
    });
  });
};

export default bidder;

```


`app.js`

Import your bidder implementation and add it as a bidProvider.

```javascript
import React from 'react';
import { Provider, Ad } from '../../src';
import prebid from 'src/bidders/prebid';

const bidHandler = ({ id, sizes }) => ({
  prebid: {
    code: id,
    mediaTypes: {
      banner: {
        sizes: sizes
      }
    },
    bids: [{
      bidder: 'appnexus',
      params: {
        placementId: 13144370
      }
    }]
  }
});

class Example extends React.Component {
  render() {
    return (
      <Provider
        bidProviders={[prebid]}        
        chunkSize={5}
        adUnitPath="header-bid-tag-0"
        networkId={19968336}
      >
        <Ad
          lazy
          type="lazy"
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-0"
          size={[300, 250]}
          sizeMap={[
            { viewPort: [0, 0], slots: [300, 250] },
          ]}
        />

        <Ad
          adUnitPath="header-bid-tag-1"
          bidHandler={bidHandler}
          lazy
          type="lazy"
          size={[728, 90]}
          sizeMap={[
            { viewPort: [0, 0], slots: [[728, 90], [70, 250]] },
          ]}
        />
      </Provider>
    );
  }
}

export default Example;

```


## Provider

| Name                  | Type     | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                       |
|-----------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bidProviders          | Bidders[] |          | Array of bidder implementations of the Bidder class that makes the request to handle the bids                                                                                                                                                                                                                                                                                                                     |
| chunkSize             | Number   |          | This will fetch ads in chunks of the specified number.                                                                                                                                                                                                                                                                                                                                            |
| networkId             | Number   |          | DFP network id.                                                                                                                                                                                                                                                                                                                                                                                   |
| bidHandler({id, sizes})| Function |          | Function used to handle the prebid bids. The function must return a prebid formatted object.                                                                                                                                                                                                                                                                                                      |
| adUnitPath            | String   |          | This will set The network Id for all of the ads. The,can overwrite this.                                                                                                                                                                                                                                                                                                                          |
| refreshDelay          | Number   |          | Time to wait before refreshing ads. This allows ads to be added to a queue beforebeing defined and refreshed. This multiple ads to be refreshed at the same time.                                                                                                                                                                                                                                 |
| setCentering          | Boolean  |          | Enables/disables centering of ads. This mode must be set before the service is enabled. Centering is disabled by default. In legacy gpt_mobile.js, centering is enabled by default.                                                                                                                                                                                                               |
| targeting          | Object   |          | Sets page level targeting for all slots. This targeting will apply to all slots.                                                                                                                                                                                                                                                                                                                  |
| bidTimeout         | Number   |          | Max amount of time a bid request can take before requesting ads.                                                                                                                                                                                                                                                                                                                                                                              |
| enableVideoAds        | Boolean  |          | Signals to GPT that video ads will be present on the page. This enables competitive exclusion constraints on display and video ads. If the video content is known, call setVideoContent in order to be able to use content exclusion for display ads.                                                                                                                                             |
| collapseEmptyDivs     | Boolean  |          | If you're using the asynchronous mode of Google Publisher Tags (GPT) and know that one or more ad slots on your page don't always get filled, you can instruct the browser to collapse empty divs by adding the collapseEmptyDivs(),method to your tags. This method may trigger a reflow of the content of your,page, so how you use it depends on how often you expect an ad slot to be,filled. |
| divider     | String  |          | Divider used when generating the ad id. This is used only if no id is set on the ad.|
| enableAds     | Boolean  |          | Disables or enables all ads. |
| lazyOffset     | String  |          | Amount of pixels an ad has to be relative to the window before lazy loading them. |
| initTimeout     | Number  |          |  Amount the bidder initiation script can take. This is used for scripts appended to the page. If no scripts are appendedi n the page then this timeout will end automatically.  |
 
## Ad

___

| Name                    | Type                       | Default               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------------------|----------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                      | String                     |                       | Id that DFP will use to identify this ad. When not set it will create a default id.                                                                                                                                                                                                                                                                                                                                                                   |
| size                    | Array                      |                       | Defines the size of the GPT slot. This value will be passed to the googletag.defineSlot() fn.                                                                                                                                                                                                                                                                                                                                                         |
| lazy                    | Boolean                    |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| style                   | Object                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| lazyOffset              | Number                     |                       | Use a value > 0 to lazy load ads x pixels before they show in the window.                                                                                                                                                                                                                                                                                                                                                                             |
| networkId               | Number                     |                       | Sets the networkId, If the parent has a network id defined it will be overwritten                                                                                                                                                                                                                                                                                                                                                                     |
| className               | String                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| priority                | Number                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| targeting               | Object                     |                       | Sets a custom targeting parameter for this slot.                                                                                                                                                                                                                                                                                                                                                                                                      |
| adUnitPath              | String                     | Provider's unitPathId | This will set The network Id for this . This overwrites the value from the .                                                                                                                                                                                                                                                                                                                                                                          |
| bidHandler(props, code) | Function                   |                       | Function that generates the bidder code for this ad unit. If the Provider has a bidHandler defined then this ad will receive the generated bids.                                                                                                                                                                                                                                                                                                      |
| sizeMap                 | Array                      |                       | Define the the viewport size and the slots allowed to be rendered in the viewportSize.This value is an array so you can define multiple ads per viewport size.                                                                                                                                                                                                                                                                                        |
| onSlotOnLoad            | Function                   |                       | This event is fired when the creative's iframe fires its load event. When rendering rich media ads in sync rendering mode, no iframe is used so no SlotOnloadEvent will be fired.ex.                                                                                                                                                                                                                                                                  |
| outOfPageSlot           | Boolean                    |                       | When set to true it sets the ad as an out of page slot.                                                                                                                                                                                                                                                                                                                                                                                               |
| setCollapseEmpty        | Boolean                    |                       | Sets whether the slot div should be hidden when there is no ad in the slot. This overrides the global,settings.                                                                                                                                                                                                                                                                                                                                       |
| onSlotRenderEnded       | Function                   |                       | This event is fired when the creative code is injected into a slot. This event will occur before the creative's resources are fetched, so the creative may not be visible yet. The event is fired by the service that rendered the slot. Example: To listen to companion ads, add a listener to the companion ads service, not the pubads service. Note: If you need to know when the creative hasfired its load event, consider the SlotOnloadEvent. |
| onImpressionViewable    | Function                   |                       | This event is fired when an impression becomes viewable, according to the ActiveView criteria.                                                                                                                                                                                                                                                                                                                                                        |
| onSlotVisibilityChanged | Function                   |                       | This event is fired whenever the on-screen percentage of an ad slot's area changes. The event is throttled and will not fire more often than once every 200ms.                                                                                                                                                                                                                                                                                        |

**sizeMapping**

example:

```javascript
[ 
    // One Ad until infinity 
    { viewPort: [1500, 200], slots: [728, 90] }, 
    // Multiple Ads until browser width >= 1500px
    { viewPort: [1250, 200], slots: [[728, 90], [970, 250]] }, 
    // No Ads until browser width >= 1250px
    { viewPort: [0, 0], slots: [] },
]
```

**onSlotOnLoad**

example:

```javascript
const onSlotLoadEvent = ({id, ref, ... e}) => ({
    console.log(`slot id is ${id}`);
}
```

**onSlotRenderEnded**

example:

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`slot ${id} rendered`);
}
```

**onImpressionViewable**

example:

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Impression for slot with id ${id} served`);
}
```

**onSlotVisibilityChanged**

example:

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Slot viewability is ${e} %`);
}
```

Tables created with: [tablesgenerator](https://www.tablesgenerator.com/markdown_tables)
