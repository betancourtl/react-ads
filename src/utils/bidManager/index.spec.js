import { processFn } from './';
import Bidder from '../Bidder';
import Queue from '../../lib/Queue';

const bidderA = new Bidder('bidderA');

bidderA.fetchBids = () => new Promise(resolve => setTimeout(resolve, 25));
bidderA.onBidWon = jest.fn();
bidderA.onTimeout = jest.fn();
bidderA.handleResponse = jest.fn();

describe('processFn', () => {
  test('Should call refreshFn when no bids or bidProviders are passed.', async () => {
    const q = new Queue();
    q.enqueue({
      priority: 1,
      data: { bidderA: { slot: 'id-1', bids: [] } }
    });

    const refresh = jest.fn();
    const getBids = jest.fn();
    await new Promise((resolve) => {
      processFn([], 200, refresh, getBids)(q, resolve);
    });
    expect(refresh).toBeCalledTimes(1);
    expect(getBids).toBeCalledTimes(0);
  });

  test`('Should call getBids when bids or bidProviders are passed.', async () => {
    const q = new Queue();
    q.enqueue({
      priority: 1,
      data: {
        bids: [
          {
            bidderA: {
              slot: 'id-1',
              bids: [
                {
                  sizes: [1, 1]
                }
              ]
            }
          }
        ]
      }
    });

    const refresh = jest.fn();
    const fakeBidsBack = [{ 
      data: [1, 2, 3], 
      status: 'fulfilled',
    }];
    const getBids = jest.fn().mockImplementation(() => Promise.resolve(fakeBidsBack));
    await new Promise((resolve) => {
      processFn([bidderA], 200, refresh, getBids)(q, resolve);
    });

    expect(getBids).toBeCalledTimes(1);
    expect(bidderA.onBidWon).toBeCalledTimes(1);
    expect(bidderA.handleResponse).toBeCalledTimes(1);
    expect(bidderA.onTimeout).toBeCalledTimes(0);
    expect(refresh).toBeCalledTimes(1);
  });
});