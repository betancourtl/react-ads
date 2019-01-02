import {
  MaybeHiddenAd as Ad,
} from './';

const providerProps = (props = {}) => ({
  provider: {
    refresh: jest.fn(),
    enableAds: true,
    adUnitPath: 'default-path',
    generateId: () => 'default-id',
    networkId: 123,
    ...props,
  }
});

const gptProps = (props = {}) => ({
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
  describe('Props', () => {
    
    describe('id', () => {
      it('Should receive an id as a prop.', () => {
        const props = { ...gptProps(), ...providerProps() };
        const wrapper = mount(<Ad
          {...props}
          id="id-1"
        />);
        expect(wrapper.props().id).toBe('id-1');
      });

      it('Should receive an id.', () => {
        const props = { ...gptProps(), ...providerProps() };
        const wrapper = mount(<Ad
          {...props}
          id="id-1"
        />);
        expect(wrapper.find('div#id-1').length).toBe(1);
      });

      it('Should receive generate an id when id is not passed.', () => {
        const props = { ...gptProps(), ...providerProps() };
        const wrapper = mount(<Ad
          {...props}
        />);
        expect(wrapper.find('div#default-id').length).toBe(1);
      });
    });

    describe('size', () => {
      it('Should receive an id.', () => {
        const props = { ...gptProps(), ...providerProps() };
        const wrapper = mount(<Ad
          {...props}
          id="id-1"
        />);
        expect(wrapper.find('div#id-1').length).toBe(1);
      });
    });

  });
});