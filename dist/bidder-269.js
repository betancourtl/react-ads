(window.webpackJsonp=window.webpackJsonp||[]).push([[269],{263:function(e,r,d){"use strict";d.r(r),d.d(r,"spec",(function(){return t}));var i=d(278),t={code:"vmg",isBidRequestValid:function(e){return void 0!==e},buildRequests:function(e,r){var d=[],i=window.location.href;try{i=void 0===r.refererInfo?window.top.location.href:r.refererInfo.referer}catch(e){}return e.forEach((function(e){d.push({adUnitCode:e.adUnitCode,referer:i,bidId:e.bidId})})),{method:"POST",url:"https://predict.vmg.nyc",data:JSON.stringify(d)}},interpretResponse:function(e,r){var d=JSON.parse(r.data),i=[];if(void 0!==e.body){var t=e.body;d.forEach((function(e){if(void 0!==t[e.adUnitCode]){var r={requestId:e.bidId,ad:"<div></div>",cpm:.01,width:0,height:0,dealId:t[e.adUnitCode],ttl:300,creativeId:"1",netRevenue:"0",currency:"USD"};i.push(r)}}))}return i}};Object(i.registerBidder)(t)}}]);