import Provider from './';
import PubSub from '../../lib/Pubsub';
import Bidder from '../../utils/Bidder';

const createProps = ({ gpt = {}, ...props } = {}) => ({
  gpt: {
    refresh: jest.fn(),
    setCentering: jest.fn(),
    setTargeting: jest.fn(),
    destroySlots: jest.fn(),
    enableServices: jest.fn(),
    enableVideoAds: jest.fn(),
    createGPTScript: jest.fn(),
    setAdIframeTitle: jest.fn(),
    collapseEmptyDivs: jest.fn(),
    disableInitialLoad: jest.fn(),
    enableSingleRequest: jest.fn(),
    enableAsyncRendering: jest.fn(),
    ...gpt,
  },
  ...props,
});

describe('<Provider />', () => {
  test('defaultProps', () => {
    const props = createProps();
    const wrapper = mount(<Provider {...props} />);
    const {
      divider,
      networkId,
      chunkSize,
      targeting,
      enableAds,
      lazyOffset,
      bidHandler,
      bidTimeout,
      bidProviders,
      refreshDelay,
      setCentering,
      enableVideoAds,
      collapseEmptyDivs,
    } = wrapper.props();
    expect(divider).toBe('_');
    expect(networkId).toBe(0);
    expect(chunkSize).toBe(5);
    expect(enableAds).toBe(true);
    expect(lazyOffset).toBe(800);
    expect(targeting).toEqual({});
    expect(bidProviders[0] instanceof Bidder).toEqual(true);
    expect(bidTimeout).toEqual(1000);
    expect(refreshDelay).toEqual(200);
    expect(bidHandler).toBe(undefined);
    expect(setCentering).toEqual(true);
    expect(enableVideoAds).toEqual(false);
    expect(collapseEmptyDivs).toEqual(false);
  });

  test('GPT initialization order', () => {
    const mockFn = jest.fn().mockImplementation(x => x);
    const props = createProps({
      gpt: {
        destroySlots: () => mockFn('destroySlots'),
        setCentering: () => mockFn('setCentering'),
        setTargeting: () => mockFn('setTargeting'),
        enableServices: () => mockFn('enableServices'),
        enableVideoAds: () => mockFn('enableVideoAds'),
        createGPTScript: () => mockFn('createGPTScript'),
        collapseEmptyDivs: () => mockFn('collapseEmptyDivs'),
        setAdIframeTitle: () => mockFn('setAdIframeTitle'),
        disableInitialLoad: x => mockFn('disableInitialLoad', x),
        enableSingleRequest: x => mockFn('enableSingleRequest', x),
        enableAsyncRendering: x => mockFn('enableAsyncRendering', x),
      }
    });
    mount(<Provider {...props} />);
    expect(mockFn.mock.calls).toEqual([
      ['createGPTScript'],
      ['setCentering'],
      ['setAdIframeTitle'],
      ['enableVideoAds'],
      ['collapseEmptyDivs'],
      ['enableAsyncRendering', true],
      ['enableSingleRequest', true],
      ['disableInitialLoad', true],
      ['setTargeting'],
      ['enableServices'],
      ['destroySlots'],
    ]);
  });

  test('generateId', () => {
    const wrapper = mount(<Provider {...createProps()} />);
    const instance = wrapper.instance();
    expect(instance.generateId()).toBe('ad_1');
    expect(instance.generateId()).toBe('ad_2');
    expect(instance.generateId('lb')).toBe('lb_1');
    expect(instance.generateId('lb')).toBe('lb_2');
    expect(instance.generateId('rect')).toBe('rect_1');
    expect(instance.generateId('rect')).toBe('rect_2');
  });

  test('Calls biddersReady when no bidProviders are passed.', () => {
    const pubsub = new PubSub();
    const biddersReady = jest.fn();
    pubsub.on('bidders-ready', biddersReady);
    const props = createProps({
      pubsub,
      bidProviders: [],
    });
    const wrapper = mount(<Provider {...props} />);
    wrapper.instance();
    expect(biddersReady).toBeCalledTimes(1);
  });

  test('Calls biddersReady when bidProviders are have loaded or timed out.', done => {
    const pubsub = new PubSub();
    const bidder1 = new Bidder('bidder1');

    bidder1.init = () => new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    const biddersReady = jest.fn();
    pubsub.on('bidders-ready', biddersReady);
    const props = createProps({
      pubsub,
      bidProviders: [bidder1]
    });
    const wrapper = mount(<Provider {...props} />);
    wrapper.instance();

    // Make sure that the event is not called.
    setTimeout(() => {
      expect(biddersReady).not.toBeCalled();
      done();
    }, 5);

    // Make sure that the event is called once it is resolved.
    setTimeout(() => {
      expect(biddersReady).toBeCalledTimes(1);
      done();
    }, 15);
  });
});

