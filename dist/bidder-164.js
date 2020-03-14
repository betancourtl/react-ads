(window.webpackJsonp=window.webpackJsonp||[]).push([[164],{114:function(e,n,o){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.r(n);var i=o(289),s=o(277),r=o(282),a=o(290).default,u=r.EVENTS.BID_REQUESTED,c=r.EVENTS.BID_TIMEOUT,d=r.EVENTS.BID_RESPONSE,l=r.EVENTS.BID_WON,f={nonInteraction:!0},p=[],b=null,m=!0,v="Prebid.js Bids",y=0,w=!1,g=null,T=null,E=!0,S={};function h(){if(m&&"function"==typeof window[b]){for(var e=0;e<p.length;e++)p[e].call();p.push=function(e){e.call()},m=!1}s.logMessage("event count sent to GA: "+y)}function D(e){return e?Math.floor(100*e):0}function $(e){return g?g(e):(e>=0&&e<.5?n="$0-0.5":e>=.5&&e<1?n="$0.5-1":e>=1&&e<1.5?n="$1-1.5":e>=1.5&&e<2?n="$1.5-2":e>=2&&e<2.5?n="$2-2.5":e>=2.5&&e<3?n="$2.5-3":e>=3&&e<4?n="$3-4":e>=4&&e<6?n="$4-6":e>=6&&e<8?n="$6-8":e>=8&&(n="$8 above"),n);var n}function N(e){e&&e.bidderCode&&p.push((function(){y++,window[b](T,"event",v,"Requests",e.bidderCode,1,f)})),h()}function A(e){e&&e.bidderCode&&p.push((function(){var n,o,t=D(e.cpm),i=e.bidderCode;if(void 0!==e.timeToRespond&&w){y++;var s=((n=e.timeToRespond)>=0&&n<200?o="0-200ms":n>=200&&n<300?o="0200-300ms":n>=300&&n<400?o="0300-400ms":n>=400&&n<500?o="0400-500ms":n>=500&&n<600?o="0500-600ms":n>=600&&n<800?o="0600-800ms":n>=800&&n<1e3?o="0800-1000ms":n>=1e3&&n<1200?o="1000-1200ms":n>=1200&&n<1500?o="1200-1500ms":n>=1500&&n<2e3?o="1500-2000ms":n>=2e3&&(o="2000ms above"),o);window[b](T,"event","Prebid.js Load Time Distribution",s,i,1,f)}if(e.cpm>0){y+=2;var r=$(e.cpm);w&&(y++,window[b](T,"event","Prebid.js CPM Distribution",r,i,1,f)),window[b](T,"event",v,"Bids",i,t,f),window[b](T,"event",v,"Bid Load Time",i,e.timeToRespond,f)}})),h()}function B(e){p.push((function(){s._each(e,(function(e){y++;var n=e.bidder;window[b](T,"event",v,"Timeouts",n,f)}))})),h()}function C(e){var n=D(e.cpm);p.push((function(){y++,window[b](T,"event",v,"Wins",e.bidderCode,n,f)})),h()}S.enableAnalytics=function(e){var n=e.provider,o=e.options;b=n||"ga",T=o&&o.trackerName?o.trackerName+".send":"send",E=void 0===o||void 0===o.sampling||Math.random()<parseFloat(o.sampling),o&&void 0!==o.global&&(b=o.global),o&&void 0!==o.enableDistribution&&(w=o.enableDistribution),o&&"function"==typeof o.cpmDistribution&&(g=o.cpmDistribution);if(E){var r=i.getEvents();s._each(r,(function(e){if("object"===t(e)){var n=e.args;if(e.eventType===u)N(n);else if(e.eventType===d)A(n);else if(e.eventType===c){B(n)}else e.eventType===l&&C(n)}})),i.on(u,(function(e){N(e)})),i.on(d,(function(e){A(e)})),i.on(c,(function(e){B(e)})),i.on(l,(function(e){C(e)}))}else s.logMessage("Prebid.js google analytics disabled by sampling");this.enableAnalytics=function(){return s.logMessage("Analytics adapter already enabled, unnecessary call to `enableAnalytics`.")}},S.getTrackerSend=function(){return T},S.getCpmDistribution=$,a.registerAnalyticsAdapter({adapter:S,code:"ga"}),n.default=S}}]);