(window.webpackJsonpreact_ads=window.webpackJsonpreact_ads||[]).push([[140],{76:function(e,r,t){"use strict";t.r(r),t.d(r,"spec",(function(){return a}));var i=t(277),d=t(280),n=t(278),a={code:"coinzilla",aliases:["czlla"],isBidRequestValid:function(e){return!!e.params.placementId},buildRequests:function(e,r){return 0===e.length?[]:e.map((function(e){var t=i.parseSizesInput(e.params.size||e.sizes)[0],d=t.split("x")[0],n=t.split("x")[1];return{method:"POST",url:"https://request.czilladx.com/serve/request.php",data:{placementId:e.params.placementId,width:d,height:n,bidId:e.bidId,referer:r.refererInfo.referer}}}))},interpretResponse:function(e,r){var t=[],i=e.body,n=i.creativeId||0,a=i.width||0,s=i.height||0,c=i.cpm||0;if(0!==a&&0!==s&&0!==c&&0!==n){var u=i.dealid||"",p=i.currency||"EUR",o=void 0===i.netRevenue||i.netRevenue,l=r.data.referer,h={requestId:i.requestId,cpm:c,width:i.width,height:i.height,creativeId:n,dealId:u,currency:p,netRevenue:o,ttl:d.b.getConfig("_bidderTimeout"),referrer:l,ad:i.ad};t.push(h)}return t}};Object(n.registerBidder)(a)}}]);