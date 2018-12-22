# react-ads

This package allows you to render DFP ads using React components

#### <Provider \/>

___

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

**disableInitialLoad(Boolean) {Function}**

Disables requests for ads on page load, but allows ads to be requested with a 
googletag.pubads().refresh() call. This should be set prior to enabling 
the service. Async mode must be used; otherwise it will be impossible to 
request ads using refresh.

**enableSingleRequest(Boolean) {Function}**

Enables single request mode for fetching multiple ads at the same time. 
This requires all pubads slots to be defined and added to the pubads service 
prior to enabling the service. Single request mode must be set before the 
service is enabled.

**enableAsyncRendering(Boolean) {Function}**

Enables async rendering mode to enable non-blocking fetching and rendering of 
ads. Because the service uses asynchronous rendering by default, you only need
 to use this method to override a previous setting. Async mode must be set 
 before the service is enabled.


**enableLazyLoad(Boolean | { fetchMarginPercent: Number, renderMarginPercent: Number,
 mobileScaling: Number }) {Function}**

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

Sefine the the viewport size and the slots allowed to be rendered in the viewportSize.
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