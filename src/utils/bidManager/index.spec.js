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
});