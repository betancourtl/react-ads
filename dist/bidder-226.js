(window.webpackJsonp=window.webpackJsonp||[]).push([[226],{199:function(e,r,n){"use strict";n.r(r),n.d(r,"spec",(function(){return a}));var d=n(278),t=n(280),i=n(279),s=n(277),c="",a={code:"richaudience",aliases:["ra"],supportedMediaTypes:[i.b,i.d],isBidRequestValid:function(e){return!!(e.params&&e.params.pid&&e.params.supplyType)},buildRequests:function(e,r){return e.map((function(e){var n={bidfloor:e.params.bidfloor,ifa:e.params.ifa,pid:e.params.pid,supplyType:e.params.supplyType,currencyCode:t.b.getConfig("currency.adServerCurrency"),auctionId:e.auctionId,bidId:e.bidId,BidRequestsCount:e.bidRequestsCount,bidder:e.bidder,bidderRequestId:e.bidderRequestId,tagId:e.adUnitCode,sizes:o(e),referer:void 0!==r.refererInfo.referer?encodeURIComponent(r.refererInfo.referer):null,numIframes:void 0!==r.refererInfo.numIframes?r.refererInfo.numIframes:null,transactionId:e.transactionId,timeout:t.b.getConfig("bidderTimeout"),user:u(e)};c=void 0!==r.refererInfo.referer?encodeURIComponent(r.refererInfo.referer):null,n.gdpr_consent="",n.gdpr=null,r&&r.gdprConsent&&(n.gdpr_consent=r.gdprConsent.consentString,n.gdpr=r.gdprConsent.gdprApplies);return{method:"POST",url:"https://shb.richaudience.com/hb/",data:JSON.stringify(n)}}))},interpretResponse:function(e,r){var n=[],d=e.body;if(d){var t={requestId:JSON.parse(r.data).bidId,cpm:d.cpm,width:d.width,height:d.height,creativeId:d.creative_id,mediaType:d.media_type,netRevenue:d.netRevenue,currency:d.currency,ttl:d.ttl,dealId:d.dealId};"video"===d.media_type?t.vastXml=d.vastXML:t.ad=d.adm,n.push(t)}return n},getUserSyncs:function(e,r,n){var d=[],t=Math.floor(9999999999*Math.random()),i="";return i=n&&"string"==typeof n.consentString?"https://sync.richaudience.com/dcf3528a0b8aa83634892d50e91c306e/?ord="+t+"&pubconsent="+n.consentString+"&euconsent="+n.consentString:"https://sync.richaudience.com/dcf3528a0b8aa83634892d50e91c306e/?ord="+t,e.iframeEnabled?d.push({type:"iframe",url:i}):e.pixelEnabled&&null!=c&&(i=void 0!==n&&void 0!==n.consentString?"https://sync.richaudience.com/bf7c142f4339da0278e83698a02b0854/?euconsent=".concat(n.consentString,"&referrer=").concat(c):"https://sync.richaudience.com/bf7c142f4339da0278e83698a02b0854/?referrer=".concat(c),d.push({type:"image",url:i})),d}};function o(e){var r;if(null!=(r=e.mediaTypes&&e.mediaTypes.banner&&e.mediaTypes.banner.sizes?e.mediaTypes.banner.sizes:e.sizes))return r.map((function(e){return{w:e[0],h:e[1]}}))}function u(e){var r=[];return e&&e.userId&&(p(e,r,"id5-sync.com",s.deepAccess(e,"userId.id5id")),p(e,r,"pubcommon",s.deepAccess(e,"userId.pubcid")),p(e,r,"criteo.com",s.deepAccess(e,"userId.criteoId")),p(e,r,"liveramp.com",s.deepAccess(e,"userId.idl_env")),p(e,r,"liveintent.com",s.deepAccess(e,"userId.lipb.lipbid")),p(e,r,"adserver.org",s.deepAccess(e,"userId.tdid"))),r}function p(e,r,n,d){s.isStr(d)&&r.push({userId:d,source:n})}Object(d.registerBidder)(a)}}]);