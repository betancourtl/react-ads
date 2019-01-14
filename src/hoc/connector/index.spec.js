/* eslint-disable react/prop-types */
import connect from './';

const TestContext1 = React.createContext({});
const TestContext2 = React.createContext({});

describe('connector', () => {
  test('Should connect a component to a Provider', () => {

    const Store1 = (props = {}) => {
      return (
        <TestContext1.Provider value={{
          id: 'test-context-prop-1',
        }}>
          {props.children}
        </TestContext1.Provider>
      );
    };

    const Store2 = (props = {}) => {
      return (
        <TestContext2.Provider value={{
          className: 'test-context-prop-2'
        }}>
          {props.children}
        </TestContext2.Provider>
      );
    };

    const TestComponent = props => <div {...props}>Hello World</div>;
    const allProps = x => ({ ...x });
    const ConnectedComponent1 = connect(TestContext2, allProps)(TestComponent);
    const ConnectedComponent2 = connect(TestContext1, allProps)(ConnectedComponent1);

    const wrapper = mount(
      <Store1>
        <Store2>
          <ConnectedComponent2 />
        </Store2>
      </Store1>
    );
    expect(wrapper.html()).toBe('<div id="test-context-prop-1" class="test-context-prop-2">Hello World</div>');
  });
});