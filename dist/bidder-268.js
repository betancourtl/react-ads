(window.webpackJsonp=window.webpackJsonp||[]).push([[268],{262:function(e,r,n){"use strict";n.r(r),n.d(r,"spec",(function(){return y}));var t=n(277),i=n(278),s=n(280),o="Bid from response has no auid parameter - ",d="Bid from response has no adm parameter - ",a="Array of bid objects is empty",p="Can't find in requested bids the bid with auid - ",u="Seatbid array from response has an empty item",c="Response is empty",f="Response has empty seatbid array",b="Seatbid from response has no array of bid objects - ",g="Currency is not supported - ",h="Currency from the request is not match currency from the response - ",l=["EUR","USD","GBP","PLN"],y={code:"visx",isBidRequestValid:function(e){return!!e.params.uid},buildRequests:function(e,r){var n,i=[],o={},d={},a={},p=e||[],u=s.b.getConfig("currency.bidderCurrencyDefault.".concat("visx"))||s.b.getConfig("currency.adServerCurrency")||"EUR";if(-1!==l.indexOf(u)){p.forEach((function(e){n=e.bidderRequestId;var r=e.params.uid,s=e.adUnitCode;i.push(r);var p=t.parseSizesInput(e.sizes);d[r]||(d[r]={});var u=d[r];u[s]?u[s].bids.push(e):u[s]={adUnitCode:s,bids:[e],parents:[]};var c=u[s];p.forEach((function(e){a[e]=!0,o[r]||(o[r]={}),o[r][e]?o[r][e].push(c):o[r][e]=[c],c.parents.push({parent:o[r],key:e,uid:r})}))}));var c={pt:"net",auids:i.join(","),sizes:t.getKeys(a).join(","),r:n,cur:u,wrapperType:"Prebid_js",wrapperVersion:"3.11.0"};return r&&(r.refererInfo&&r.refererInfo.referer&&(c.u=r.refererInfo.referer),r.gdprConsent&&(r.gdprConsent.consentString&&(c.gdpr_consent=r.gdprConsent.consentString),c.gdpr_applies="boolean"==typeof r.gdprConsent.gdprApplies?Number(r.gdprConsent.gdprApplies):1)),{method:"GET",url:"https://t.visx.net/hb",data:c,bidsMap:o}}t.logError(g+u)},interpretResponse:function(e,r){e=e&&e.body;var n,i=[],s=[],o=r.bidsMap,d=r.data.cur;return e?e.seatbid&&!e.seatbid.length&&(n=f):n=c,!n&&e.seatbid&&(e.seatbid.forEach((function(e){m(function(e){e?e.bid?e.bid[0]||t.logError(a):t.logError(b+JSON.stringify(e)):t.logError(u);return e&&e.bid&&e.bid[0]}(e),o,d,i,s)})),s.forEach((function(e){m(e,o,d,i)}))),n&&t.logError(n),i},getUserSyncs:function(e,r,n){if(e.pixelEnabled){var t=[];return n&&(n.consentString&&t.push("gdpr_consent="+encodeURIComponent(n.consentString)),t.push("gdpr_applies="+encodeURIComponent("boolean"==typeof n.gdprApplies?Number(n.gdprApplies):1))),[{type:"image",url:"https://t.visx.net/push_sync"+(t.length?"?"+t.join("&"):"")}]}}};function m(e,r,n,i,s){if(e){var a;if(e.auid||(a=o+JSON.stringify(e)),e.adm){var u=n||"EUR",c=r[e.auid];if(c)if(e.cur&&e.cur!==u)a=h+u+" - "+e.cur;else{var f=s?"".concat(e.w,"x").concat(e.h):Object.keys(c)[0];if(c[f]){var b=c[f][0],g=b.bids.shift();i.push({requestId:g.bidId,bidderCode:y.code,cpm:e.price,width:e.w,height:e.h,creativeId:e.auid,currency:u,netRevenue:!0,ttl:360,ad:e.adm,dealId:e.dealid}),b.bids.length||b.parents.forEach((function(e){var n=e.parent,i=e.key,s=e.uid,o=n[i].indexOf(b);o>-1&&n[i].splice(o,1),n[i].length||(delete n[i],t.getKeys(n).length||delete r[s])}))}else s&&s.push(e)}else a=p+e.auid}else a=d+JSON.stringify(e);a&&t.logError(a)}}Object(i.registerBidder)(y)}}]);