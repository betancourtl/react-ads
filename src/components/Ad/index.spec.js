import {
  Ad,
} from './';

const createProps = (props = {}) => ({
  refresh: jest.fn(),
  enableAds: true,
  adUnitPath: '',
  networkId: 123,
  define: jest.fn(),
  display: jest.fn(),
  cmdPush: jest.fn(),
  destroyAd: jest.fn(),
  addService: jest.fn(),
  sizeMapping: jest.fn(),
  getWindowWidth: jest.fn(),
  addEventListener: jest.fn(),
  ...props,
});

describe('<Ad />', () => {
  test('defaultProps', () => {
    const props = createProps();
    const wrapper = mount(<Ad {...props} />);
    const {
      id,
      size,
      lazy,
      priority,
      sizeMap,
      targeting,
      adUnitPath,
      lazyOffset,
      className,
      type,
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
    expect(targeting).toEqual({});
    expect(adUnitPath).toBe('');
    expect(lazyOffset).toBe(-1);
    expect(className).toBe('');
    expect(type).toBe('default');
    expect(onSlotOnLoad).toBe(null);
    expect(outOfPageSlot).toBe(false);
    expect(setCollapseEmpty).toBe(false);
    expect(onSlotRenderEnded).toBe(null);
    expect(onImpressionViewable).toBe(null);
    expect(onSlotVisibilityChanged).toBe(null);
    // gptEvents
  });

  test('non-lazy', () => {
    const props = createProps();
    mount(<Ad {...props} />);
    expect(props.cmdPush).toBeCalledTimes(1);
  });

  test('non-lazy', () => {
    const props = createProps({ lazy: true });
    const refreshWhenVisible = jest.spyOn(Ad.prototype, 'refreshWhenVisible');
    mount(<Ad {...props} />);
    expect(props.cmdPush).toBeCalledTimes(0);
    expect(refreshWhenVisible).toBeCalledTimes(1);
  });

  test('calls correct functions in componentWillMount', () => {
    const props = createProps({
      cmdPush: (fn) => fn(),
      onSlotOnLoad: jest.fn(),
      onSlotRenderEnded: jest.fn(),
      onImpressionViewable: jest.fn(),
      onSlotVisibilityChanged: jest.fn(),
      lazy: false,
    });

    const handleGPTEvent = jest.spyOn(Ad.prototype, 'handleGPTEvent');
    const setMappingSize = jest.spyOn(Ad.prototype, 'setMappingSize');
    const setMQListeners = jest.spyOn(Ad.prototype, 'setMQListeners');
    const setCollapseEmpty = jest.spyOn(Ad.prototype, 'setCollapseEmpty');
    const setTargeting = jest.spyOn(Ad.prototype, 'setTargeting');
    const display = jest.spyOn(Ad.prototype, 'display');
    const refresh = jest.spyOn(Ad.prototype, 'refresh');
    const wrapper = mount(<Ad {...props} />);
    expect(props.define).toBeCalledTimes(1);
    expect(handleGPTEvent).toBeCalledTimes(4);
    expect(setMappingSize).toBeCalledTimes(1);
    expect(setMQListeners).toBeCalledTimes(1);
    expect(setCollapseEmpty).toBeCalledTimes(1);
    expect(setTargeting).toBeCalledTimes(1);
    expect(display).toBeCalledTimes(1);
    expect(wrapper.instance().displayed).toBe(true);
    expect(refresh).toBeCalledTimes(1);
    expect(props.refresh).toBeCalledTimes(1);
    expect(wrapper.instance().refreshed).toBe(true);
  });

  test('componentWillUnmount', () => {
    const props = createProps({ lazy: false });
    const wrapper = mount(<Ad {...props} />);
    const componentWillUnmount = jest.spyOn(Ad.prototype, 'componentWillUnmount');
    const unsetMQListeners = jest.spyOn(Ad.prototype, 'unsetMQListeners');
    wrapper.unmount();
    expect(componentWillUnmount).toBeCalledTimes(1);
    expect(unsetMQListeners).toBeCalledTimes(1);
    expect(props.destroyAd).toBeCalledTimes(1);
  });

  test('refresh', () => {
    const props = createProps({
      lazy: false,
      id: 'ad-1',
      sizeMap: [
        { viewPort: [850, 200], slots: [728, 90] },
        { viewPort: [0, 0], slots: [] },
      ],
      bidHandler: ({id, sizes}) => ({ id, sizes }),
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
});