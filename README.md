[![Build Status](https://travis-ci.com/webdeveloperpr/react-ads.svg?branch=master)](https://travis-ci.com/webdeveloperpr/react-ads)
# react-ads

This package allows you to render ads with DFP and Prebid. All prebid modules 
are split into separte chunks, that way you only load what you need.

API
- [Provider](#provider)
- [Ad](#ad)
- [Bider](#bidder)
- [withAdRefresh](#withAdRefresh)

Reference
- [Refreshing ads](#refresh)

Example
- [Example](#example)
- [Storybook](https://webdeveloperpr.github.io/react-ads)

## Installation

```shell
  npm i react-ads --save 
```

**webpack**

Copy the bidder files into your assets dir. They can't 
be loaded directly from `react-ads/dist/bidders`.

Use the `copy-webpack-plugin` to do this if using weback

```js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var babelConfig = require('./babel.config');
var CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  plugins: [
  // Use the copy plugin to copy all the bundles into your statics dir.
  // That way they can be lazy-loaded.
    new CopyPlugin([
      {
        from: 'node_modules/react-ads/dist/bidders/bidder-*.js',
        to: 'bidders/',
        flatten: true,
      }
    ])
  ]
};
```

**Non webpack**

just copy and paste `node_modules/react-ads/dist/bidders/bidder-*.js` files
into your statics dir `statics/bidders/all-the-bidder-files`


## Example

`app.js`

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
        bidders={['criteoBidAdapter', 'appnexusBidAdapter']}        
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

| Name                  | Type      | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                       |
|-----------------------|-----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bidProviders          | Bidders[] |          | Array of bidder implementations of the Bidder class that makes the request to handle the bids                                                                                                                                                                                                                                                                                                     |
| bidders               | String[]  |    []    | Set the prebid bidders that you want to use. The bidders will be lazyloaded via script tags. This allows us to only import bidders that we want to use.                                                                                                                                                                                                                                           |
| adIframeTitle         | String    |          | Sets that title for all ad container iframes created by pubads service, from this point onwards.                                                                                                                                                                                                                                                                                                  |
| chunkSize             | Number    |          | This will fetch ads in chunks of the specified number.                                                                                                                                                                                                                                                                                                                                            |
| networkId             | Number    |          | DFP network id.                                                                                                                                                                                                                                                                                                                                                                                   |
| bidHandler({id, sizes})| Function |          | Function used to handle the prebid bids. The function must return a prebid formatted object.                                                                                                                                                                                                                                                                                                      |
| adUnitPath            | String    |          | This will set The network Id for all of the ads. The,can overwrite this.                                                                                                                                                                                                                                                                                                                          |
| refreshDelay          | Number    |          | Time to wait before refreshing ads. This allows ads to be added to a queue beforebeing defined and refreshed. This multiple ads to be refreshed at the same time.                                                                                                                                                                                                                                 |
| setCentering          | Boolean   |          | Enables/disables centering of ads. This mode must be set before the service is enabled. Centering is disabled by default. In legacy gpt_mobile.js, centering is enabled by default.                                                                                                                                                                                                               |
| targeting             | Object    |          | Sets page level targeting for all slots. This targeting will apply to all slots.                                                                                                                                                                                                                                                                                                                  |
| bidTimeout            | Number    |          | Max amount of time a bid request can take before requesting ads.                                                                                                                                                                                                                                                                                                                                  |
| enableVideoAds        | Boolean   |          | Signals to GPT that video ads will be present on the page. This enables competitive exclusion constraints on display and video ads. If the video content is known, call setVideoContent in order to be able to use content exclusion for display ads.                                                                                                                                             |
| collapseEmptyDivs     | Boolean   |          | If you're using the asynchronous mode of Google Publisher Tags (GPT) and know that one or more ad slots on your page don't always get filled, you can instruct the browser to collapse empty divs by adding the collapseEmptyDivs(),method to your tags. This method may trigger a reflow of the content of your,page, so how you use it depends on how often you expect an ad slot to be,filled. |
| divider               | String    |          | Divider used when generating the ad id. This is used only if no id is set on the ad.|
| enableAds             | Boolean   |          | Disables or enables all ads. |
| lazyOffset            | String    |          | Amount of pixels an ad has to be relative to the window before lazy loading them. |
| initTimeout           | Number    |          |  Amount the bidder initiation script can take. This is used for scripts appended to the page. If no scripts are appendedi n the page then this timeout will end automatically.  |
 
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

## Bidder

Bidder is a class that is used to get bids. It provides an interface that makes it easier
to communicate with the bidManager.  This library is mainly intended to be used
with prebid but there are other bidders like amazon that do not want to be part
of the prebid project. For this reason this Bidder class can be used to include them
or any other bidders that are not part of prebid.js. The bidder class accepts 
the bidder name when it is instantiated. `new Bidder('prebid')`. Then you must
define the Bidder methods below to handle the bidding process.


| Name                  | Type     | Default  | Description |
|-----------------------|----------|----------|-------------|
| init                  | Promise \| Function  |  | Init is the function that is used to initiate the bidder. You might be adding async scripts into the DOM here or loading bidding modules. |
| handleResponse        | Function   |        | This fn handles the bid response. It gets the results of the bid.|
| onTimeout             | Function   |        | Do something whenever the bid times out.|
| onBidWon              | Function   |        | Do something whenever the bids got back.|
| fetchBids             | Promise    |        | Makes the Bid call and returns the result as a promise. |

## withAdRefresh

withAdRefresh will pass the custom refresh function to a component.
This can be used to refresh ads by their id.

```javascript
const Button = withAdRefresh(UnwrappedComponent);
```

## Refresh

Refresh can be called in 5 different ways.

**Imperative refresh**

An Imperative refresh can be done by reching into the DOM and directly
refreshing the ad.

```javascript
  const el = document.querySelector('#ad-1');
  el && el.refresh();
```

**Dispatched custom event**

You can refresh an ad by dispatching a custom event and providing the id of the
ad that you want to refresh.

```javascript
  window.dispatchEvent(new CustomEvent('refresh-ad', { detail: { id: 'leaderboard_1' } }));
```

**Media query refresh**

When an ad has a defined sizeMapping it will refresh automatically whenever it 
enters a ceratin breakpoint.

```javascript
        <Ad
          lazy
          type="lazy"
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-0"
          size={[300, 250]}
          sizeMap={[
            { viewPort: [0, 0], slots: [300, 250] },
            { viewPort: [800, 200], slots: [300, 600] },
          ]}
        />

```

**Lazy load refresh**

Lazy loaded ads can call the refresh fn whenever it goes into the 
visible threashold.

```javascript
        <Ad
          lazy
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-0"
          size={[300, 250]}
        />

```

**withAdRefresh hoc refresh**

Some developers might prefer wrapping their components with an HOC that can
pass the refresh function to some other component. You can use the 
`withAdRefresh` hoc to receive the refreshAdById fn.

```javascript
class UnwrappedComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 'leaderboard_1',
    };
  }

  render() {
    return (
      <div>

        <div>
          <label>
            Refresh ad
          </label>
          <input
            type="text"
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
          />
          <button onClick={() => this.props.refreshAdById(this.state.value)}>
            Refresh
          </button>
        </div>
       
        <br/>
       
        <div>
          <label>
            Refresh All Ads
          </label>
          <button onClick={() => {
            const adIds = [...document.querySelectorAll('[data-react-ad]')].map(x => x.id);
            this.props.refreshAdById(adIds);
          }}>
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

const Button = withAdRefresh(UnwrappedComponent);
```


## Examples:

**sizeMapping**


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

```javascript
const onSlotLoadEvent = ({id, ref, ... e}) => ({
    console.log(`slot id is ${id}`);
}
```

**onSlotRenderEnded**


```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`slot ${id} rendered`);
}
```

**onImpressionViewable**


```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Impression for slot with id ${id} served`);
}
```

**onSlotVisibilityChanged**


```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Slot viewability is ${e} %`);
}
```

Tables created with: [tablesgenerator](https://www.tablesgenerator.com/markdown_tables)
