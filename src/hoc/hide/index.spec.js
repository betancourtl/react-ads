import hideHOC from './';

describe('hideHOC', () => {
  test('should hide the component', () => {
    const TestComponent = () => <div>Test Component</div>;
    const WrappedComponent = hideHOC(TestComponent);
    const wrapper = mount(<WrappedComponent />);
    expect(wrapper.html()).toBe(null);
  });

  test('should show the component', () => {
    const TestComponent = () => <div>Test Component</div>;
    const WrappedComponent = hideHOC(TestComponent);
    const wrapper = mount(<WrappedComponent enableAds />);
    expect(wrapper.html()).toBe('<div>Test Component</div>');
  });
});