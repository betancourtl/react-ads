import { Ad, stateToProps } from './';

const createProps = ({ gpt, ...props } = {}) => ({
  adUnitPath: '',
  networkId: 123,
  enableAds: true,
  define: jest.fn(),
  refresh: jest.fn(),
  generateId: jest.fn(),
  getWindowWidth: jest.fn(),
  gpt: {
    define: jest.fn(),
    display: jest.fn(),
    cmdPush: jest.fn(),
    addService: jest.fn(),
    generateId: jest.fn(),
    sizeMapping: jest.fn(),
    destroySlots: jest.fn(),
    addEventListener: jest.fn(),
    ...gpt
  },
  ...props,
});

describe('<Ad />', () => {
  // mock RAF
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  test('defaultProps', () => {
    const props = createProps();
    const wrapper = mount(<Ad {...props} />);
    const {
      id,
      lazy,
      size,
      type,
      sizeMap,
      priority,
      className,
      targeting,
      adUnitPath,
      generateId,
      lazyOffset,
      onSlotOnLoad,
      outOfPageSlot,
      setCollapseEmpty,
      onSlotRenderEnded,
      onImpressionViewable,
      onSlotVisibilityChanged

    } = wrapper.props();
    expect(id).toBe('');
    expect(size).toEqual([]);
    expect(lazy).toBe(false);
    expect(priority).toBe(1);
    expect(sizeMap).toBe(null);
    expect(className).toBe('');
    expect(adUnitPath).toBe('');
    expect(lazyOffset).toBe(-1);
    expect(type).toBe('default');
    expect(targeting).toEqual({});
    expect(onSlotOnLoad).toBe(null);
    expect(outOfPageSlot).toBe(false);
    expect(setCollapseEmpty).toBe(false);
    expect(onSlotRenderEnded).toBe(null);
    expect(generateId).toEqual(generateId);
    expect(onImpressionViewable).toBe(null);
    expect(onSlotVisibilityChanged).toBe(null);
  });

  test('non-lazy', () => {
    const props = createProps();
    mount(<Ad {...props} />);
    expect(props.gpt.cmdPush).toBeCalledTimes(1);
  });

  test('non-lazy', () => {
    const props = createProps({ lazy: true });
    const refreshWhenVisible = jest.spyOn(Ad.prototype, 'refreshWhenVisible');
    mount(<Ad {...props} />);
    expect(props.gpt.cmdPush).toBeCalledTimes(0);
    expect(refreshWhenVisible).toBeCalledTimes(1);
  });

  test('calls correct functions in componentWillMount', () => {
    const props = createProps({
      gpt: {
        cmdPush: (fn) => fn(),
      },
      onSlotOnLoad: jest.fn(),
      onSlotRenderEnded: jest.fn(),
      onImpressionViewable: jest.fn(),
      onSlotVisibilityChanged: jest.fn(),
      lazy: false,
    });

    const display = jest.spyOn(Ad.prototype, 'display');
    const refresh = jest.spyOn(Ad.prototype, 'refresh');
    const setTargeting = jest.spyOn(Ad.prototype, 'setTargeting');
    const handleGPTEvent = jest.spyOn(Ad.prototype, 'handleGPTEvent');
    const setMappingSize = jest.spyOn(Ad.prototype, 'setMappingSize');
    const setMQListeners = jest.spyOn(Ad.prototype, 'setMQListeners');
    const setCollapseEmpty = jest.spyOn(Ad.prototype, 'setCollapseEmpty');
    const wrapper = mount(<Ad {...props} />);
    expect(props.gpt.define).toBeCalledTimes(1);
    expect(handleGPTEvent).toBeCalledTimes(4);
    expect(setMappingSize).toBeCalledTimes(1);
    expect(setMQListeners).toBeCalledTimes(1);
    expect(setCollapseEmpty).toBeCalledTimes(1);
    expect(setTargeting).toBeCalledTimes(1);
    expect(display).toBeCalledTimes(1);
    expect(wrapper.instance().displayed).toBe(true);
    expect(refresh).toBeCalledTimes(1);
    expect(props.refresh).toBeCalledTimes(1);
    expect(wrapper.instance().refreshedOnce).toBe(true);
  });

  test('componentWillUnmount', () => {
    const props = createProps({ lazy: false });
    const wrapper = mount(<Ad {...props} />);
    const componentWillUnmount = jest.spyOn(Ad.prototype, 'componentWillUnmount');
    const unsetMQListeners = jest.spyOn(Ad.prototype, 'unsetMQListeners');
    wrapper.unmount();
    expect(componentWillUnmount).toBeCalledTimes(1);
    expect(unsetMQListeners).toBeCalledTimes(1);
    expect(props.gpt.destroySlots).toBeCalledTimes(1);
  });

  test('refresh', () => {
    const props = createProps({
      lazy: false,
      id: 'ad-1',
      sizeMap: [
        { viewPort: [850, 200], slots: [728, 90] },
        { viewPort: [0, 0], slots: [] },
      ],
      bidHandler: ({ id, sizes }) => ({ id, sizes }),
      getWindowWidth: () => 1000,
      priority: 10,
    });
    const wrapper = mount(<Ad {...props} />);
    wrapper.instance().slot = 'Im a slot';
    expect(wrapper.props().id).toBe('ad-1');
    wrapper.instance().refresh();
    expect(props.refresh).toBeCalledWith({
      priority: 10,
      data: {
        bids: {
          id: 'ad-1',
          sizes: [728, 90],
        },
        slot: 'Im a slot',
      }
    });
  });

  test('breakPointRefresh, is called if the displayed property is true.', () => {
    const props = createProps();
    const refreshMock = props.refresh;
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    instance.displayed = true;
    instance.breakPointRefresh();
    expect(refreshMock).toBeCalledTimes(1);
  });

  test('breakPointRefresh, is not called if the displayed property is false.', () => {
    const props = createProps();
    const refreshMock = props.refresh;
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    instance.displayed = false;
    instance.breakPointRefresh();
    expect(refreshMock).toBeCalledTimes(0);
  });

  test(
    `refreshWhenVisible, is called when 
    props.lazy = true
    this.isVisible = true
    this.refreshedOnce = false
  `, () => {
      jest.spyOn(Ad.prototype, 'isVisible', 'get').mockImplementation(() => true);
      const define = jest.spyOn(Ad.prototype, 'define');
      const props = createProps({
        lazy: true,
      });
      const wrapper = mount(<Ad {...props} />);
      const instance = wrapper.instance();
      instance.refreshedOnce = false;
      //expected conditions
      expect(wrapper.props().lazy).toBe(true);
      expect(instance.isVisible).toBe(true);
      expect(instance.refreshedOnce).toBe(false);
      expect(define).toBeCalledTimes(1);
    });

  test(
    `refreshWhenVisible does not call define when
      props.lazy = true
      this.isVisible = false
      this.refreshedOnce = false
    `, () => {
      jest.spyOn(Ad.prototype, 'isVisible', 'get').mockImplementation(() => false);
      const define = jest.spyOn(Ad.prototype, 'define');
      const props = createProps({
        lazy: true,
      });
      const wrapper = mount(<Ad {...props} />);
      const instance = wrapper.instance();
      instance.refreshedOnce = false;
      //expected conditions
      expect(wrapper.props().lazy).toBe(true);
      expect(instance.isVisible).toBe(false);
      expect(instance.refreshedOnce).toBe(false);
      expect(define).toBeCalledTimes(0);
    });

  test('Should get the size prop if no sizeMap is defined.', () => {
    const props = createProps({
      lazy: true,
      size: [250, 300],
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    expect(instance.mapSize).toEqual(props.size);
  });

  test('Should get the sizeMap based on the windowWidth.', () => {
    const props = createProps({
      lazy: true,
      size: [250, 300],
      getWindowWidth: () => 800,
      sizeMap: [
        { viewPort: [750, 200], slots: [[728, 90], [728, 250]] },
        { viewPort: [0, 0], slots: [] }
      ]
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    expect(instance.mapSize).toEqual([[728, 90], [728, 250]]);
  });

  test('Should get the sizeMap based on the windowWidth.', () => {
    const props = createProps({
      lazy: true,
      size: [250, 300],
      getWindowWidth: () => 749,
      sizeMap: [
        { viewPort: [750, 200], slots: [[728, 90], [728, 250]] },
        { viewPort: [0, 0], slots: [] }
      ]
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    expect(instance.mapSize).toEqual([]);
  });

  test('should call setCollapseEmpty and set it to true', () => {
    const props = createProps({
      lazy: true,
      size: [250, 300],
      setCollapseEmpty: true,
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.slot = {};
    instance.slot.setCollapseEmptyDiv = mockFn;
    instance.setCollapseEmpty();
    expect(mockFn).toHaveBeenCalledWith(true, true);
  });

  test('should call setCollapseEmpty and not set it to true', () => {
    const props = createProps({
      lazy: true,
      size: [250, 300],
      setCollapseEmpty: false,
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.slot = {};
    instance.slot.setCollapseEmptyDiv = mockFn;
    instance.setCollapseEmpty();
    expect(mockFn).not.toBeCalled();
  });

  test('setTargeting', () => {
    const props = createProps({
      size: [250, 300],
      targeting: {
        firstName: 'Luis',
        lastName: 'Betancourt',
      }
    });
    const wrapper = mount(<Ad {...props} />);
    const instance = wrapper.instance();
    const mockFn = jest.fn();
    instance.slot = {};
    instance.slot.setTargeting = mockFn;
    instance.setTargeting();
    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn.mock.calls).toEqual([
      ['firstName', 'Luis'],
      ['lastName', 'Betancourt']
    ]);
  });
});

describe('stateToProps', () => {
  test('should use the providers networkId and adUnitPath.', () => {
    const providerProps = {
      adUnitPath: 'provider',
      networkId: 11,
      lazyOffset: 100
    };

    const adProps = {
      adUnitPath: '',
      networkId: '',
    };

    const results = stateToProps(providerProps, adProps);
    expect(results.adUnitPath).toEqual('/11/provider');
    expect(results.lazyOffset).toEqual(100);
  });

  test('should use the Ad\'s networkId and adUnitPath.', () => {
    const providerProps = {
      adUnitPath: 'provider',
      networkId: 11,
      lazyOffset: 100
    };

    const adProps = {
      adUnitPath: 'ad',
      networkId: 22,
      lazyOffset: 200
    };

    const results = stateToProps(providerProps, adProps);
    expect(results.adUnitPath).toEqual('/22/ad');
    expect(results.lazyOffset).toEqual(200);
  });

  test('should return a bidHandler that uses the provider and ad bidHandlers.', () => {
    const providerProps = {
      bidHandler: () => 'a',
    };

    const adProps = {
      bidHandler: (x, y) => [x, y].join(''),
    };

    const results = stateToProps(providerProps, adProps);
    expect(results.bidHandler('b')).toEqual('ba');
  });

  test('should return a bidHandler from the Ad.', () => {
    const providerProps = {
    };

    const adProps = {
      bidHandler: (x, y) => [x, y].join(''),
    };

    const results = stateToProps(providerProps, adProps);
    expect(results.bidHandler('b', 'a')).toEqual('b');
  });

  test('should return a bidHandler from the Provider.', () => {
    const providerProps = {
      bidHandler: (x, y) => [x, y].join(''),
    };

    const adProps = {      
    };

    const results = stateToProps(providerProps, adProps);
    expect(results.bidHandler('b', 'a')).toEqual('b');
  });
});