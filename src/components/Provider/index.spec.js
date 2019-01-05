import Provider from './';

const createProps = ({ gpt = {}, ...props } = {}) => ({
  gpt: {
    refresh: jest.fn(),
    setCentering: jest.fn(),
    setTargeting: jest.fn(),
    destroySlots: jest.fn(),
    enableServices: jest.fn(),
    enableVideoAds: jest.fn(),
    createGPTScript: jest.fn(),
    collapseEmptyDivs: jest.fn(),
    disableInitialLoad: jest.fn(),
    enableSingleRequest: jest.fn(),
    enableAsyncRendering: jest.fn(),
    createGoogleTagEvents: jest.fn(),
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
      bidProviders,
      bidHandler,
      bidTimeout,
      refreshDelay,
      setCentering,
      enableVideoAds,
      collapseEmptyDivs,
    } = wrapper.props();
    expect(divider).toBe('_');
    expect(networkId).toBe(0);
    expect(chunkSize).toBe(4);
    expect(enableAds).toBe(true);
    expect(lazyOffset).toBe(800);
    expect(targeting).toEqual({});
    expect(bidProviders).toEqual([]);
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
        createGPTScript: () => mockFn('createGPTScript'),
        createGoogleTagEvents: () => mockFn('createGoogleTagEvents'),
        setCentering: () => mockFn('setCentering'),
        enableVideoAds: () => mockFn('enableVideoAds'),
        collapseEmptyDivs: () => mockFn('collapseEmptyDivs'),
        enableAsyncRendering: (x) => mockFn('enableAsyncRendering', x),
        enableSingleRequest: (x) => mockFn('enableSingleRequest', x),
        disableInitialLoad: (x) => mockFn('disableInitialLoad', x),
        setTargeting: () => mockFn('setTargeting'),
        enableServices: () => mockFn('enableServices'),
        destroySlots: () => mockFn('destroySlots'),
      }
    });
    mount(<Provider {...props} />);
    expect(mockFn.mock.calls).toEqual([
      ['createGPTScript'],
      ['createGoogleTagEvents'],
      ['setCentering'],
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

  test('GenerateId', () => {
    const wrapper = mount(<Provider {...createProps} />);
    const instance = wrapper.instance();
    expect(instance.generateId('rect')).toBe('rect_1');
    expect(instance.generateId('rect')).toBe('rect_2');
    expect(instance.generateId('lb')).toBe('lb_1');
    expect(instance.generateId('lb')).toBe('lb_2');
    expect(instance.generateId()).toBe('ad_1');
    expect(instance.generateId()).toBe('ad_2');
  });
});

