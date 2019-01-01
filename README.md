# react-gpt-prebid-ads

This package allows you to render ads with DFP and Prebid using React components.

## <Provider \/>

| Name                  | Type     | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                       |
|-----------------------|----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prebid                | Function |          | A custom prebid initialization function.                                                                                                                                                                                                                                                                                                                                                          |
| chunkSize             | Number   |          | This will fetch ads in chunks of the specified number.                                                                                                                                                                                                                                                                                                                                            |
| networkId             | Number   |          | DFP network id.                                                                                                                                                                                                                                                                                                                                                                                   |
| adUnitPath            | String   |          | This will set The network Id for all of the ads. The,can overwrite this.                                                                                                                                                                                                                                                                                                                          |
| refreshDelay          | Number   |          | Time to wait before refreshing ads. This allows ads to be added to a queue beforebeing defined and refreshed. This multiple ads to be refreshed at the same time.                                                                                                                                                                                                                                 |
| setCentering          | Boolean  |          | Enables/disables centering of ads. This mode must be set before the service is enabled. Centering is disabled by default. In legacy gpt_mobile.js, centering is enabled by default.                                                                                                                                                                                                               |
| setTargeting          | Object   |          | Sets page level targeting for all slots. This targeting will apply to all slots.                                                                                                                                                                                                                                                                                                                  |
| prebidTimeout         | Number   |          | Prebid bids timeout.                                                                                                                                                                                                                                                                                                                                                                              |
| enableVideoAds        | Boolean  |          | Signals to GPT that video ads will be present on the page. This enables competitive exclusion constraints on display and video ads. If the video content is known, call setVideoContent in order to be able to use content exclusion for display ads.                                                                                                                                             |
| collapseEmptyDivs     | Boolean  |          | If you're using the asynchronous mode of Google Publisher Tags (GPT) and know that one or more ad slots on your page don't always get filled, you can instruct the browser to collapse empty divs by adding the collapseEmptyDivs(),method to your tags. This method may trigger a reflow of the content of your,page, so how you use it depends on how often you expect an ad slot to be,filled. |
| prebidFailsafeTimeout | Number   |          | Prebid bids timeout, in case the prebid timeout goes wrong.                                                                                                                                                                                                                                                                                                                                       |
 
## <Ad  \/>

___

| Name                    | Type                       | Default               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|-------------------------|----------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                      | String                     |                       | Id that DFP will use to identify this ad. When not set it will create a default id.                                                                                                                                                                                                                                                                                                                                                                   |
| size                    | Array                      |                       | Defines the size of the GPT slot. This value will be passed to the googletag.defineSlot() fn.                                                                                                                                                                                                                                                                                                                                                         |
| lazy                    | Boolean                    |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| style                   | Object                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| lazyOffset              | Number                     |                       | Use a value > 0 to lazy load ads x pixels before they show in the window.                                                                                                                                                                                                                                                                                                                                                                             |
| className               | String                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| priority                | Number                     |                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| targeting               | Object                     |                       | Sets a custom targeting parameter for this slot.                                                                                                                                                                                                                                                                                                                                                                                                      |
| adUnitPath              | String                     | Provider's unitPathId | This will set The network Id for this . This overwrites the value from the .                                                                                                                                                                                                                                                                                                                                                                          |
| bidderCode              | Function                   |                       | Function that generates the bidder code for this ad unit.                                                                                                                                                                                                                                                                                                                                                                                             |
| sizeMapping             | Array || [[Number,Number]] |                       | Define the the viewport size and the slots allowed to be rendered in the viewportSize.This value is an array so you can define multiple ads per viewport size.                                                                                                                                                                                                                                                                                        |
| onSlotOnLoad            | Function                   |                       | This event is fired when the creative's iframe fires its load event. When rendering rich media ads in sync rendering mode, no iframe is used so no SlotOnloadEvent will be fired.ex.                                                                                                                                                                                                                                                                  |
| outOfPageSlot           | Boolean                    |                       | When set to true it sets the ad as an out of page slot.                                                                                                                                                                                                                                                                                                                                                                                               |
| SetCollapseEmpty        | Boolean                    |                       | Sets whether the slot div should be hidden when there is no ad in the slot. This overrides the global,settings.                                                                                                                                                                                                                                                                                                                                       |
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

**bidderCode**

example:

```javascript
const bidderCode = (adUnitId, sizes) => ({
    code: adUnitId,
    mediaTypes: {
        banner: {
            sizes: sizes,
        },
    },
    bids: [
        {
            "bidder": "ix",
            "params": {
            "siteId": "211035",
            "size": [
                300,
                250
            ]
            }
        },
        {
            "bidder": "ix",
            "params": {
            "siteId": "211036",
            "size": [
                300,
                600
            ]
            }
        }
    ],
});
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

## Example

```javascript

import React from 'react';
import prebid from '@webdeveloperpr/prebid';
import { Provider, Ad } from 'react-gpt-prebid-ads';

const bidderCode = (id, sizes) => ({
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
});

class Page extends React.Component {
  render() {
    return (
      <Provider
        prebid={prebid}
        chunkSize={5}
        setCentering={true}
        prebidTimeout={1000}
        prebidFailsafeTimeout={1200}
        adUnitPath="header-bid-tag-0"
        networkId={19968336}
      >
        <Ad
          id="div-1"
          adUnitPath="header-bid-tag-0"
          lazy
          bidderCode={bidderCode}
          size={[300, 250]}
          sizeMapping={[
            { viewPort: [0, 0], slots: [300, 250] },
          ]}
        />

        <Ad
          id="div-2"
          adUnitPath="header-bid-tag-1"
          lazy
          bidderCode={bidderCode}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [0, 0], slots: [[728, 90], [70, 250]] },
          ]}
        />
      </Provider>
    );
  }
}

export default Page;

```

Tables created with: [tablesgenerator](https://www.tablesgenerator.com/markdown_tables)
