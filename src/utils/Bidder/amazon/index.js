/* eslint-disable no-console */
import { Bidder } from 'react-ads';
import loadScript from './initialize';

const bidder = new Bidder('amazon');

bidder.init = () => {
  loadScript();
  window.apstag.init({
    pubID: 123,
    adServer: 'googletag',
    bidTimeout: 1000,
  });
  console.log('amazon initialized');
};

bidder.fetchBids = adUnits => new Promise((resolve, reject) => {
  const id = setTimeout(reject, bidder.safeTimeout);

  const bids = adUnits.reduce((acc, { bids }) => {
    const newAcc = acc.concat(bids);
    return newAcc;
  }, []);

  window.apstag.fetchBids({ slots: bids }, (...props) => {
    clearTimeout(id);
    resolve(...props);
  });
});

bidder.onBidWon = () => {
  console.log('amazon:onBidWon');
};

bidder.onTimeout = () => {
  console.log('amazon:timeout');
};

bidder.handleResponse = (bids) => {
  const googletag = window.googletag;
  googletag.cmd.push(function () {
    console.log('amazon bids', bids);
    bids.forEach(({ amzniid, amznbid, slotID }) => {
      window.googletag
        .pubads()
        .getSlots().forEach(slot => {
          const id = slot.getSlotElementId();
          if (id === slotID) {
            slot.setTargeting('amzniid', amzniid);
            slot.setTargeting('amznbid', amznbid);
          }
        });
    });
  });
};

export default bidder;
