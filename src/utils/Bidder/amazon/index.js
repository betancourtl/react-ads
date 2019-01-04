import Bidder from '../';
// import loadScript from './initialize';

const bidder = new Bidder('amazon');

bidder.init = () => {
  // loadScript();
  // window.apstag.init({
  //   pubID: 3143,
  //   adServer: 'googletag',
  //   bidTimeout: 1000,
  // });
  console.log('amazon initialized');
};

bidder.fetchBids = adUnits => new Promise((resolve, reject) => {
  setTimeout(reject, bidder.safeTimeout);
  if (bidder.isReady === false) reject({});
  console.log('amazon:fetchBids');
  // window.apstag.fetchBids({ slots }, resolve);
});

bidder.onBidWon = () => {
  console.log('amazon:onBidWon');
};

bidder.onTimeout = () => {
  console.log('amazon:timeout');
};

bidder.handleResponse = (bids) => {
  console.log('amazon:response');
};

export default bidder;