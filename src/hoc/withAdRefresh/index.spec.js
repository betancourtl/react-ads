/* eslint-disable react/prop-types */
import withAdRefresh from './';
import { AdsContext } from '../../components/context';

describe('withAdRefresh', () => {
  test('Should create an element with the refreshAdbyId props.', () => {
    const TestComponent = props => {
      return (
        <button
          onClick={props.refreshAdById}
        >
          Click Me!
        </button>
      );
    };

    const WrappedTestComponent = withAdRefresh(TestComponent);
    const ctx = { refreshAdById: jest.fn(), };
    const wrapper = mount(
      <AdsContext.Provider
        value={ctx}
      >
        <WrappedTestComponent />
      </AdsContext.Provider>
    );
    
    wrapper.find('button').simulate('click');
    expect(ctx.refreshAdById).toHaveBeenCalledTimes(1);
  });
});