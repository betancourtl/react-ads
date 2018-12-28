# react-ads

This package allows you to render DFP ads using React components

#### <Provider \/>

___

**networkId {Number}**

This will set The network Id for all of the ads.

**setTargetomg {Object}**

Sets page level targeting for all slots. This targeting will apply to all slots.

**chunkSize {Number}**

This will fetch ads in chunks of the specified number.

**defineDelay {Number}**

Time to wait before defining ads. This allows ads to be added to a queue before
being defined and displayed. This is usefull for taking advantage of SRA.

**refreshDelay {Number}**

Time to wait before refreshing ads. This allows ads to be added to a queue before
being defined and refreshed. This multiple ads to be refreshed at the same time.

**adUnitPath {String}**

This will set The network Id for all of the ads. The <Ad \/> can overwrite this.

**setCentering(Boolean) {Function}**

Enables/disables centering of ads. This mode must be set before the service is 
enabled. Centering is disabled by default. In legacy gpt_mobile.js, centering 
is enabled by default.

**enableVideoAds(Boolean) {Function}**

Signals to GPT that video ads will be present on the page. This enables 
competitive exclusion constraints on display and video ads. If the video 
content is known, call setVideoContent in order to be able to use content 
exclusion for display ads.

**collapseEmptyDivs(Boolean, Boolean?) {Function}**

If you're using the asynchronous mode of Google Publisher Tags (GPT) 
and know that one or more ad slots on your page don't always get filled, you can
 instruct the browser to collapse empty divs by adding the collapseEmptyDivs() 
 method to your tags. This method may trigger a reflow of the content of your 
 page, so how you use it depends on how often you expect an ad slot to be 
 filled.

**disableInitialLoad {Boolean}**

Disables requests for ads on page load, but allows ads to be requested with a 
googletag.pubads().refresh() call. This should be set prior to enabling 
the service. Async mode must be used; otherwise it will be impossible to 
request ads using refresh.

**enableSingleRequest {Boolean}**

Enables single request mode for fetching multiple ads at the same time. 
This requires all pubads slots to be defined and added to the pubads service 
prior to enabling the service. Single request mode must be set before the 
service is enabled.

**enableAsyncRendering {Boolean}**

Enables async rendering mode to enable non-blocking fetching and rendering of 
ads. Because the service uses asynchronous rendering by default, you only need
 to use this method to override a previous setting. Async mode must be set 
 before the service is enabled.

**enableLazyLoad  {Boolean|Object}**

Enables lazy loading in GPT as defined by the config object.

ex.

```javascript
googletag.pubads().enableLazyLoad({
  fetchMarginPercent: 500,  // Fetch slots within 5 viewports.
  renderMarginPercent: 200,  // Render slots within 2 viewports.
  mobileScaling: 2.0  // Double the above values on mobile.
});
```

**Notes:**

- Lazy loading only works if using async rendering.
- Lazy fetching in SRA only works if all slots are outside the fetching margin.
- Lazy fetching does not currently work with collapseEmptyDivs.

#### <Ad  \/>

___

**adUnitPath {String}**

This will set The network Id for this <Ad \/>. This overwrites the value from 
the <Provider \/>.

**style {Object}**

**className {String}**

**targeting {Object}**

Sets a custom targeting parameter for this slot.

**outOfPageSlot {Boolean}**

When set to true it sets the ad as an out of page slot.

**id {String}**

Id that DFP will use to identify this ad.

**setCollapseEmpty {String}**

Sets whether the slot div should be hidden when there is no ad in the slot. 
This overrides the global <Provider\/> settings.

**adUnitPath {String}**

Define the AdUnit's path to where DFP will be making the calls to.

**size {Array}**

Defines the size of the GPT slot. This value will be passed to the 
googletag.defineSlot() fn.

**sizeMapping {Array}**

Define the the viewport size and the slots allowed to be rendered in the viewportSize.
This value is an array so you can define multiple ads per viewport size.

ex.

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

**onSlotOnLoad {Function}**

This event is fired when the creative's iframe fires its load event. When 
rendering rich media ads in sync rendering mode, no iframe is used so no 
SlotOnloadEvent will be fired.

ex.

```javascript
const onSlotLoadEvent = ({id, ref, ... e}) => ({
    console.log(`slot id is ${id}`);
}
```

**onSlotRenderEnded {Function}**

This event is fired when the creative code is injected into a slot. This event 
will occur before the creative's resources are fetched, so the creative may not 
be visible yet. The event is fired by the service that rendered the slot. 
Example: To listen to companion ads, add a listener to the companion ads 
service, not the pubads service. Note: If you need to know when the creative has
fired its load event, consider the SlotOnloadEvent.

ex.

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`slot ${id} rendered`);
}
```

**onImpressionViewable {Function}**

This event is fired when an impression becomes viewable, according to the Active
View criteria.

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Impression for slot with id ${id} served`);
}
```

**onSlotVisibilityChanged {Function}**

This event is fired whenever the on-screen percentage of an ad slot's area 
changes. The event is throttled and will not fire more often than once every 
200ms.

```javascript
const onSlotLoadEvent = ({id, ref, ...e}) => ({
    console.log(`Slot viewability is ${e} %`);
}
```

## Ad Loading strategies
___

|  Infinite Scroll                           	                        |
|-----------------------------------------------------------------------|
| Define Slots                              	                        |
| googletag.pubads().enableSingleRequest(); 	                        |
| googletag.pubads().disableInitialLoad();  	                        |
| googletag.enableServices();               	                        |
| googletag.display(slotName); && googletag.pubads().refresh([slot]);   |

| Event-based ad requesting/rendering                                   |
|-----------------------------------------------------------------------|
| Define Slots                                                          |
| googletag.pubads().enableSingleRequest();                             |
| googletag.pubads().disableInitialLoad();                              |
| googletag.enableServices();                                           |
| googletag.display(slotName);                                          |
| googletag.pubads().refresh([slot]);                                   |

| Lazy loading                                                          |
|-----------------------------------------------------------------------|
| Define Slots                                                          |
| googletag.pubads().enableLazyLoad();                                  |
| googletag.enableServices();                                           |
| googletag.display(slotName);                                          |

**enableSingleRequest()**

Enables single request mode for fetching multiple ads at the same time. This 
requires all pubads slots to be defined and added to the pubads service prior to 
enabling the service. Single request mode must be set before the service is 
enabled.

**disableInitialLoad()**

Disables requests for ads on page load, but allows ads to be requested with a 
googletag.pubads().refresh() call. This should be set prior to enabling the 
service. Async mode must be used; otherwise it will be impossible to request ads
 using refresh.

**googletag.display(divOrSlot)**

Enables all GPT services that have been defined for ad slots on the page.
Instructs slot services to render the slot. Each ad slot should only be 
displayed once per page. All slots must be defined and have a service associated
with them before being displayed. The display call must not happen until the 
element is present in the DOM. The usual way to achieve that is to place it 
within a script block within the div element named in the method call. 
If single request architecture (SRA) is being used, all unfetched ad slots at the 
moment display is called will be fetched in a single instance of 
googletag.display(). To force an ad slot not to display, the entire div must be 
removed.

Infinite Scroll and event based ad requesting/rendering setups call the same 
functions. The only difference is that:

infinite scroll calls

```javascript
// Both fns get called.
googletag.display(slotName); && googletag.pubads().refresh([slot]); 
```

Event-based ad requesting/rendering

```javascript
// Ad gets fetched but not rendered.
googletag.display(slotName); 
```

```javascript
// Ad gets rendered.
googletag.display(slotName); 
```

## DEVELOPMENT NOTES

### Initializing GPT

These are the only 2 ways to properly initialize the google tag manager.

| Define page-level settings 	|    Define Enable Display   	|
|:--------------------------	|:--------------------------	|
| Define page-level settings 	| Define page-level settings 	|
| Define slots               	| enableServices()           	|
| enableServices()           	| Define slots               	|
| Display slots              	| Display slots              	|

**Which one is better?**

Probably Define-Enable-Display according to the google DFP reference site:

[enableSingleRequest](https://developers.google.com/doubleclick-gpt/reference#
googletag.PubAdsService_enableSingleRequest)

> Enables single request mode for fetching multiple ads at the same time. **This
requires all pubads slots to be defined and added to the pubads service prior to
enabling the service**. Single request mode must be set before the service is 
enabled.

So to take advantage of SRA we have to define all slots before enabling the 
service.

 ## Future Features
___

| Features                                            | Status |
|-----------------------------------------------------|--------|
| 1. Create initial ads Heap                             | ok  |
| 2. Create Lazy Loaded Ads Heap                         | ok  |
| 3. Create Custom Lazy Loading functionality            | ok  |
| 4. Create Heap extraction/fetching/re-extraction logic | ok  |
| 5. Integrate Prebid.JS                                 | x   |
| 6. Add Unit Testing Framework                          | x   |
| 7. Add Line Item Generator Utils                       | x   |
| 8. Lazy wrapper function to set make sections lazy.    | x   |
| 9. Add provider gpt event hooks                        | x   |

## AdCallManager

The AdCallManager should provide a heaping mechanism for loading ads based on priority, and also for controlling when events happen.
___

The AdCallManager consists of the following data structures.

- AdHeap
- InitialQueue
- LazyQueue
- LazyRefreshQueue

**AdHeap**

The AdHeap is in charge of prioritizing the ads in order. The priority order is based on load type and level type.

Priority level data structure is defined below:

```javascript
// ENUMS = ['initial', 'lazy']
    {
        type: 'ENUM'
        level: 'NUMBER',
        cb: 'FUNCTION' 
    }
```

### Priority types levels

1. Initial
2. Lazy

### Priority numbers

1. #1 highest priority
2. #2 lowest priority
3. ...

Ads with the highest priority should be added to the top of 
the heap to allow faster fetching/renderings.

**InitialQueue**

The Initial Queue is in charge of storing the defineSlot callbacks from the <\/Ad> components.

**LazyQueue**

The Lazy Queue is in charge of storing the defineSlot callbacks from the lazy loaded <\/Ad> components.

**LazyRefreshQueue**

The lazy refresh queue is in charge of queing the refresh calls from the lazy-loaded ads.

### AdCallManager
___

The AdCallManager synchronizes the heap and queue's so they can execute in the correct order.

**What are the steps that the adCallManager should take to process the calls?**

1. AdCall manager receives a request to display ads. The add() function will accept a callback.

2. The add function will then call the debounced function process. The debounced function will have a debounced timeout set to the processDebounce variable.

3. The process function will grab the amount of ads defined in chunkSize from the heap. Ads with type initial will be added to the InitialHeap, Ads with the lazy type will be added tothe LazyHeap.

4. processInitialAds will accept an InitialAdHeap object, dequeue it and call the cb function.

5. The processLazyAds will accept a LazyQueue object, dequeue it  and then call cb function.


**InitialAds**

initial ads are refreshed in bulk.

If the ad is of initial type it will be added to a new initial heap. Initial ads will be iterated over and then it will call the `googletag.refresh([id,id,id, ...])` fn(). This will refresh the ads.

### Processing extracted lazy ads.

Lazy Ads are in charge of asking to display and asking to refresh. The display part is ran  The refresh fn call should then add the refresh calls to a new Refresh Queue so that they can call the `googletag.refresh([id,id,id, ...])` fn(). in bulk and bennefit from the SRA architecture.

## Prebid.js

**What is prebid.js**

Prebid.js is a library that implements headerbidding. This library will provide 
us with with their bidder adapters. These adapters are mostly created by 
vendors. 

**Why prebid.js**

Prebid.js has almost all of the bidders that we currently use. It also provides
additional bidders that we can swap out without us having to create their
implementation from srcratch.

**How does a bidder work?**

A bidder requests bids from exchange servers. It will then set the bids as
targeting data on the ad slots. Whenever the ad slots render, it will make a
request to DFP with the bid information.

**How to implement prebis.js?**

1. Define the PREBID_TIMEOUT
2. Define the FAILSAFE_TIMEOUT

```javascript
<html>

    <head>
        <link rel="icon" type="image/png" href="/favicon.png">
        <script async src="//www.googletagservices.com/tag/js/gpt.js"></script>
        <script async src="//acdn.adnxs.com/prebid/not-for-prod/1/prebid.js"></script>
        <script>
            var sizes = [
                [300, 250]
            ];
            var PREBID_TIMEOUT = 1000;
            var FAILSAFE_TIMEOUT = 3000;

            var adUnits = [{
                code: '/19968336/header-bid-tag-1',
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
            }];

            // ======== DO NOT EDIT BELOW THIS LINE =========== //
            var googletag = googletag || {};
            googletag.cmd = googletag.cmd || [];
            googletag.cmd.push(function() {
                googletag.pubads().disableInitialLoad();
            });

            var pbjs = pbjs || {};
            pbjs.que = pbjs.que || [];

            pbjs.que.push(function() {
                pbjs.addAdUnits(adUnits);
                pbjs.requestBids({
                    bidsBackHandler: initAdserver,
                    timeout: PREBID_TIMEOUT
                });
            });

            function initAdserver() {
                if (pbjs.initAdserverSet) return;
                pbjs.initAdserverSet = true;
                googletag.cmd.push(function() {
                    pbjs.que.push(function() {
                        pbjs.setTargetingForGPTAsync();
                        googletag.pubads().refresh();
                    });
                });
            }
            
            // in case PBJS doesn't load
            setTimeout(function() {
                initAdserver();
            }, FAILSAFE_TIMEOUT);

            googletag.cmd.push(function() {
                googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
                	.addService(googletag.pubads());
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
            });

        </script>

    </head>

    <body>
        <h2>Basic Prebid.js Example</h2>
        <h5>Div-1</h5>
        <div id='div-1'>
            <script type='text/javascript'>
                googletag.cmd.push(function() {
                    googletag.display('div-1');
                });

            </script>
        </div>
    </body>

</html>
```







Tables created with: https://www.tablesgenerator.com/markdown_tables