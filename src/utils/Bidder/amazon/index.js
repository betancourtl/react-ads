/* eslint-disable no-console */
import Bidder from '../';
import loadScript from './initialize';

const bidder = new Bidder('amazon');

bidder.init = (addScript = loadScript) => {
  addScript();
  window.apstag.init({
    pubID: 123,
    adServer: 'googletag',
    bidTimeout: 1000,
  });
};

bidder.fetchBids = adUnits => new Promise((resolve) => {
  const bids = adUnits.reduce((acc, { bids }) => {
    const newAcc = acc.concat(bids);
    return newAcc;
  }, []);

  window.apstag.fetchBids({ slots: bids }, (...props) => {
    resolve(...props);
  });
});

bidder.onBidWon = () => {
};

bidder.onTimeout = () => {
};

bidder.handleResponse = bids => {
  const googletag = window.googletag;
  googletag.cmd.push(function () {
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
