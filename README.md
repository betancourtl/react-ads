# react-ads

This package allows you to render DFP ads using React components

### NOTES

Common mistakes:

Misordering the call order, here are 2 valid orders:

**Define-Enable-Display**

- Define page-level settings
- Define slots
- enableServices()
- Display slots

**Enable-Define-Display**

- Define page-level settings
- enableServices()
- Define slots
- Display slots

**Which one is better?**

Probably Define-Enable-Display according to the google DFP reference site:

[enableSingleRequest](https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_enableSingleRequest)

> Enables single request mode for fetching multiple ads at the same time. **This requires all pubads slots to be defined and added to the pubads service prior to enabling the service**. Single request mode must be set before the service is enabled.

So to take advantage of SRA we have to define all slots before enabling the service.

**Defining Ads before the page loads**

// Do not enableServices when the provider loads.
// googletag.display() calls will get sent to the queue
// Everytime an item gets added to the queue it will call a debounced function.
// The debounced function will extract the display callbacks
// When the queue hits lenght of 0 it will call the enableServices.


