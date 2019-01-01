import { Ad } from './index';

const provider = {
  refresh: spy(),
  enableAds: true,
  adUnitPath: 'test-path',
  generateId: () => 'generated-id',
  networkId: 123,
};



describe('Ad Component', () => {
  it('renders an ad', () => {
    const wrapper = shallow(
      <Ad
        id="ad-1"
        provider={provider}
      />
    );
    console.log(wrapper.html());
  });
});