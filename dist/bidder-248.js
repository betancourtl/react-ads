(window.webpackJsonp=window.webpackJsonp||[]).push([[248],{235:function(e,r,t){"use strict";t.r(r),t.d(r,"spec",(function(){return a}));var n=t(278),d=t(280);function i(){return(i=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}).apply(this,arguments)}var a={code:"sublime",aliases:[],isBidRequestValid:function(e){return!!e.params.zoneId},buildRequests:function(e,r){var t={sublimeVersion:"0.4.0",prebidVersion:"3.11.0",currencyCode:d.b.getConfig("currency.adServerCurrency")||"EUR",timeout:d.b.getConfig("bidderTimeout")};return r&&r.refererInfo&&(t.referer=r.refererInfo.referer,t.numIframes=r.refererInfo.numIframes),r&&r.gdprConsent&&(t.gdprConsent=r.gdprConsent.consentString,t.gdpr=r.gdprConsent.gdprApplies),e.map((function(e){var r={adUnitCode:e.adUnitCode,auctionId:e.auctionId,bidder:e.bidder,bidderRequestId:e.bidderRequestId,bidRequestsCount:e.bidRequestsCount,requestId:e.bidId,sizes:e.sizes.map((function(e){return{w:e[0],h:e[1]}})),transactionId:e.transactionId,zoneId:e.params.zoneId};return{method:"POST",url:(e.params.protocol||"https")+"://"+(e.params.bidHost||"pbjs.sskzlabs.com")+"/bid",data:i({},t,r),options:{contentType:"application/json",withCredentials:!0}}}))},interpretResponse:function(e,r){var t=[],n=e.body;if(n){if(n.timeout||!n.ad||n.ad.match(/<!-- No ad -->/gim))return t;var d={width:1800,height:1e3};r&&r.data&&1===r.data.w&&1===r.data.h&&(d={width:1,height:1});var i={requestId:n.requestId||"",cpm:n.cpm||0,width:n.width||d.width,height:n.height||d.height,creativeId:n.creativeId||1,dealId:n.dealId||1,currency:n.currency||"EUR",netRevenue:n.netRevenue||!0,ttl:n.ttl||600,ad:n.ad};t.push(i)}return t}};Object(n.registerBidder)(a)}}]);