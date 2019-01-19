## DEVELOPMENT NOTES

 ### Future Features
___

| Features                                            | Status |
|-----------------------------------------------------|--------|
| 1. Create initial ads Heap                             | ok  |
| 2. Create Lazy Loaded Ads Heap                         | ok  |
| 3. Create Custom Lazy Loading functionality            | ok  |
| 4. Create Heap extraction/fetching/re-extraction logic | ok  |
| 5. Integrate Prebid.JS                                 | ok  |
| 6. Add Unit Testing Framework                          | ok  |
| 10. Disable loading ads                                | ok  |
| 11. Create dynamic ids                                 | ok  |
| 12. Add sizes dynamically on pregid bid request        | ok  |
| 13. Update prebid.js bidder to use the new config size | ok  |
| 14. Update the visibility function to use offsets      | ok  |
| 15. Add ix bidder helper                               | ok  |
| 16. Add a way to handle custom bids (amazon)           | ok  |
| 17. Create a prebid Handler configuration              | ok  |
| 18. Implement Ad to Ad communication for firing events | x   |
| 19. Implement Instream Video                           | x   |
| 20. Wait for init scripts to finish loading            | ok  |


### Ad Loading strategies
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

**enableSingleRequest**

Enables single request mode for fetching multiple ads at the same time. This 
requires all pubads slots to be defined and added to the pubads service prior to 
enabling the service. Single request mode must be set before the service is 
enabled.

**disableInitialLoad**

Disables requests for ads on page load, but allows ads to be requested with a 
googletag.pubads().refresh() call. This should be set prior to enabling the 
service. Async mode must be used; otherwise it will be impossible to request ads
 using refresh.

**display**

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


#### AdCallManager

The adCall manager is a JobQueue for refreshing ads in chunks. Some pages load
20+ ads. The JobQueue allows to fetch ads in smaller chunks to allow more more 
bids on fewer ads.

#### Prebid.js

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

#### prebid.js sizeConfig

The prebid.js size config defines the allowed slot sizes on the page. Below is
an example of how prebid.js defines the sizes. The media queries specify which
sizes to bid on. 

**adSlot**

Here we define the sizes that this add will have.

```javascript
pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [970, 90],
                [728, 90],
                [300, 250],
                [300, 100]
            ]
        }
    },
    labelAny: ["visitor-uk"]
    /* The full set of bids, not all of which are relevant on all devices */
    bids: [{
            bidder: "pulsepoint",
            /* Labels flag this bid as relevant only on these screen sizes. */
            labelAny: ["desktop", "tablet"],
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
    ]
}]);
```

**Size Config**

Here we define the sizes that prebid will bid on, based on the media query,
and the sizes defined in the adSlot. This size config is GLOBAL!! which means
that it could result in many edge cases.

```javascript
pbjs.setConfig({
    sizeConfig: [{
        'mediaQuery': '(min-width: 1600px)',
        'sizesSupported': [
            [1000, 300],
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop-hd']
    }, {
        'mediaQuery': '(min-width: 1200px)',
        'sizesSupported': [
            [970, 90],
            [728, 90],
            [300, 250]
        ],
        'labels': ['desktop']
    }, {
        'mediaQuery': '(min-width: 768px) and (max-width: 1199px)',
        'sizesSupported': [
            [728, 90],
            [300, 250]
        ],
        'labels': ['tablet']
    }, {
        'mediaQuery': '(min-width: 0px)',
        'sizesSupported': [
            [300, 250],
            [300, 100]
        ],
        'labels': ['phone']
    }]
});
```

#### googletag sizeMapping without using sizeConfig

googletag provides a way to show/hide ads based on media queries and it 
specifies the adSizes to display on the specific media query.

We need to tell prebid which ads to fetch based on the sizes defined on the 
slot without using the sizeConfig.

**Why not use the sizeConfig?**

The size config defined global settings for requesting bids. We want to bid on 
the exact sizes defined in the googletag sizeMap.

case 1:

- window width is 1000px

In this we only want to fetch bids for the **large** ad slot. So we tell prebid
the sizes that we want to bid on by setting the `metiaTypes.banner.sizes` 
property.

**sizeMapping**

```javascript
var mapping1 = googletag.sizeMapping().
    addSize([1024, 768], [970, 250]). // large  <- current breakpoint
    addSize([980, 690], [728, 90]). // medium
    addSize([640, 480], 'fluid'). //sm
    addSize([0, 0], [88, 31]). // xs
    build();
```

We define the sizes in `metdiaTypes.banner.sizes` from the large size above.

**prebid adUnit**

```javascript
pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [970, 250],
            ]
        }
    },
    bids: [{
            bidder: "pulsepoint",
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
    ]
}]);
```

case 2:

- window width is 1000px (large) breakpoint
- We move down to 980px (medium) breakpoint

The window width is (large) and the (medium) breakpoint was triggered. Now
we have to update the prebid adUnit config to fetch the new bids.

**sizeMapping**

```javascript
var mapping1 = googletag.sizeMapping().
    addSize([1024, 768], [970, 250]). // large <----- old breakpoint
    addSize([980, 690], [728, 90]). // medium <------ new breakpoint
    addSize([640, 480], 'fluid'). //sm
    addSize([0, 0], [88, 31]). // xs
    build();
```

We define the (medium) sizes in `mediaTypes.banner.sizes` property before
requesting bids.

**prebid adUnit**

```javascript
pbjs.addAdUnits([{
    code: "ad-slot-1",
    mediaTypes: {
        banner: {
            sizes: [
                [728, 90], // medium <----- Replaced [970, 250]
            ]
        }
    },
    bids: [{
            bidder: "pulsepoint",
            params: {
                "cf": "728X90",
                "cp": 123456,
                "ct": 123456
            }
        },
    ]
}]);
```

Would this solution work for requesting bids when using googletags?

How to implement the proposed solution?

1. save the current ad sizes on the components state.
2. When the media query refresh function gets called. Trigger the 
refresh function and pass the new sizes. Clear the targeting and request 
new bids.

### bidder helpers.

Making idx bids is somewhat tedious whenever ceratin adUnits have to be mapped to certain sizes.

**idx**

Working with index is relatively easy. Once you have a copy of your map slots, you can use the idxBids helper to generate the bid code for you.


```javascript
import { ixBids } from './';

const indx = {
  xSlots: {
    14: { siteId: '211035', size: [300, 250] },
    15: { siteId: '211036', size: [300, 600] },
    16: { siteId: '211037', size: [300, 1050] },
  },
  mapping: {
    rect_1: ['14', '15', '16'],
  }
};

const yourAdUnitSizes = [[300, 250], [300, 600]];
const adUnitName = 'rect_1';

describe.only('ixBidder helper', () => {
  it('should map adUnit name to sizes', () => {
    const bids = ixBids(indx)(adUnitName, yourAdUnitSizes);
  });
});

// generates

// [
//   {
//     "bidder": "ix",
//     "params": {
//       "siteId": "211035",
//       "size": [
//         300,
//         250
//       ]
//     }
//   },
//   {
//     "bidder": "ix",
//     "params": {
//       "siteId": "211036",
//       "size": [
//         300,
//         600
//       ]
//     }
//   }
// ]
```

Use it in your bidder code like this:

```javascript
const bidderCode = (adUnitId, sizes) => ({
    code: adUnitId,
    mediaTypes: {
        banner: {
            sizes: sizes,
        },
    },
    bids: [
        // other bidder
        {
            bidder: 'criteo',
            params: {
                zoneId: 1234567,
            },
        },
        // ixBidder
        ...ixBids(adUnitId, sizes),
    ],
});
```

**rubicon**

 Once you have a copy of your map slots, you can use the rubiconBids helper to generate the bid code for you.


```javascript
import { _rubiconBids as rubiconBids } from './';

const accountId = 1090;

const screen = {
  mobile: 'mobile',
  desktop: 'desktop',
};

const rubiconMap = [
  // mobile
  { zoneId: 705194, siteId: 65531, mq: screen.mobile, size: [300, 250], accountId },
  { zoneId: 706194, siteId: 85531, mq: screen.mobile, size: [320, 50], accountId },
];

// curry the map to avoid doing this every time.
export default curriedRubiconBids(rubiconMap);
```

Use it in your bidder code like this:

```javascript
const bidderCode = (adUnitId, sizes) => ({
    code: adUnitId,
    mediaTypes: {
        banner: {
            sizes: sizes,
        },
    },
    bids: [        
        ...curriedRubiconBids('mobile', sizes),
    ],
});
```

## Custom prebid bid handlers.

There are a lot of bidders that we can use with prebid. This is good but,
it ends up adding a little bit of complexity because now we need to create
different bidder configurations. 

It would be nice to have a convention for creating and defining bidders to use.
That way once the configuration is done you could apply default bidders or 
overwrite them.

The provider could define the bidders to use by default, for every Ad slot.
The Ad could use defaults or select the bidders that they want.

**Provider**

The provider would receive the bidder configuration which should be a 
a function like the current bidderCode Fn from the <Ad \/> component.

This configuration will be passed to the children via context.

```javascript
    const bidderCode = (props) => {},
```

**Ad**

The children component can also define a bidderCode fn which will get the 
result of the parents bidderCode fn. 

```javascript
    const bidderCode = (props, code) => {},
```

This would enable a composible way to decorate the bidder configuration.

### Initial bidQueue

One problem that I see with loading ads is that they start loading way down
on the component tree on bigger applications. This is bad because we have to 
wait for components higher up on the tree to finish rendering before we make
the bid call. This could end up being very slow on SSR apps.

One solution would be to register the <Ad \/> id's in the <Provider \/> on the 
<Ad \/> componentWillMount fn. This would allow us to save the id's in the 
provider serverside. Then as soon as the client renders we can then fire the 
request to fetch the bids before the page loads. We would then save the bids in 
a map and <Ad \/> makes calls refresh it can first look to see if there is a bid 
already. If there is a bid then we can call the targeting fn for the Ad and fire 
the refresh. This would significantly Ad loading speed if it ends up working. 
Ads that would bennefit from this are initial-loading ads. Lazy loading ads
would not bennefit from this but that is ok.

Looks like componentWillmount is deprecated so there is no use in trying to
implement this solution.

## Custom bids.

Right now prebid supports most of the popular bidders, and then there is Amazon.
They do not want to be part of prebid.js which is bad for us developers. Now
a custom implementation would be required.

The bids flow is a so. 

- Ad renders.
- Requests get debounced and queued.
- Ads are dequeued in chunks.
- Ads ask for bids (prebid right now).
- Bids come back.
- Targeting is set.
- API call is made.

If where to support custom bids we would have to basically use the same 
flow to process the bids. 

There could be different bidHandlers. maybe instead of returning an array from 
the bidderHandler we could return an object with keys.

```javascript
const bidderCode = (adUnitId, sizes) => ({
  prebid: {
    code: adUnitId,
    mediaTypes: {
      banner: {
        sizes: sizes,
      },
    },
    bids: [
      {
        bidder: 'criteo',
        params: {
          zoneId: 1234567,
        },
      },
    ],
  },
  amazon: {
      // amazon code
  },
  other: {
    // other bidder's code
  }
});

```

The provider would need to handle the bids by using a bid configuration similar
to the on the one that prebid.js uses.

```javascript
import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'example';
export const spec = {
        code: BIDDER_CODE,
        aliases: ['ex'], // short code
        /**
         * Determines whether or not the given bid request is valid.
         *
         * @param {BidRequest} bid The bid params to validate.
         * @return boolean True if this is a valid bid, and false otherwise.
         */
        isBidRequestValid: function(bid) {
            return !!(bid.params.placementId || (bid.params.member && bid.params.invCode));
        },
        /**
         * Make a server request from the list of BidRequests.
         *
         * @param {validBidRequests[]} - an array of bids
         * @return ServerRequest Info describing the request to the server.
         */
        buildRequests: function(validBidRequests) {
            const payload = {
                /*
                Use `bidderRequest.bids[]` to get bidder-dependent
                request info.

                If your bidder supports multiple currencies, use
                `config.getConfig(currency)` to find which one the ad
                server needs.

                Pull the requested transaction ID from
                `bidderRequest.bids[].transactionId`.
                */
            };
            const payloadString = JSON.stringify(payload);
            return {
                method: 'POST',
                url: ENDPOINT_URL,
                data: payloadString,
            };
        },
        /**
         * Unpack the response from the server into a list of bids.
         *
         * @param {ServerResponse} serverResponse A successful response from the server.
         * @return {Bid[]} An array of bids which were nested inside the server.
         */
        interpretResponse: function(serverResponse, bidRequest) {
            // const serverBody  = serverResponse.body;
            // const headerValue = serverResponse.headers.get('some-response-header');
            const bidResponses = [];
            const bidResponse = {
                requestId: bidRequest.bidId,
                cpm: CPM,
                width: WIDTH,
                height: HEIGHT,
                creativeId: CREATIVE_ID,
                dealId: DEAL_ID,
                currency: CURRENCY,
                netRevenue: true,
                ttl: TIME_TO_LIVE,
                referrer: REFERER,
                ad: CREATIVE_BODY
            };
            bidResponses.push(bidResponse);
        };
        return bidResponses;
    },

    /**
     * Register the user sync pixels which should be dropped after the auction.
     *
     * @param {SyncOptions} syncOptions Which user syncs are allowed?
     * @param {ServerResponse[]} serverResponses List of server's responses.
     * @return {UserSync[]} The user syncs which should be dropped.
     */
    getUserSyncs: function(syncOptions, serverResponses) {
        const syncs = []
        if (syncOptions.iframeEnabled) {
            syncs.push({
                type: 'iframe',
                url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html'
            });
        }
        if (syncOptions.pixelEnabled && serverResponses.length > 0) {
            syncs.push({
                type: 'image',
                url: serverResponses[0].body.userSync.url
            });
        }
        return syncs;
    }

    /**
     * Register bidder specific code, which will execute if bidder timed out after an auction
     * @param {data} Containing timeout specific data
     */
    onTimeout: function(data) {
        // Bidder specifc code
    }

    /**
     * Register bidder specific code, which will execute if a bid from this bidder won the auction
     * @param {Bid} The bid that won the auction
     */
    onBidWon: function(bid) {
        // Bidder specific code
    }

    /**
     * Register bidder specific code, which will execute when the adserver targeting has been set for a bid from this bidder
     * @param {Bid} The bid of which the targeting has been set
     */
    onSetTargeting: function(bid) {
        // Bidder specific code
    }
}
registerBidder(spec);

```

**props**

this.isReady = false;
this.name = '';
this.bidQueue = '';

There are a few methods necessary for a BidProvider class.

**init**

This should be a function that provides the initialization functionality.

**isBidRequestValid**
This makes sure that the bid is in a valid format.

**buildRequests**

This should be the function that provides the the logic for fetching the bids.

**onBidWin**

This function do something when the bid wins. Maybe logging.

**onBidTimeout**

This function should handle the case when the bidder times out.

**interpretResponse**

This function should be in charge of formatting the bids when the bid is won.

**onSetTargeting**

This function is in charge of setting the targeting before
the API call is made.

**getBids**

Function used to get the bids.

## Wait for bidders to finish loading.

Some of the bidders could be installed via scripts and this will take some time 
install. We have to delay the bids from being called until the scripts finish 
installing, or until a certain ammount of time passes. This will allow us 
quickly move to making a request if the init script takes too long.

- Add Provider tests.
- Add JobQueue tests.
- Add a PubSub to the JobQueue in order to notify events for testing purposes.

Tables created with: [tablesgenerator](https://www.tablesgenerator.com/markdown_tables)