import connect from '../connector';
import { AdsContext } from '../../components/context';

/**
 * Will wrap a Component with the the refreshAdById function.
 * @param {React.Context} AdsContext - The Ad Provider context.
 * @param {Function} props - Provider props to pass to the wrapped component.
 * @returns {React.Component}
 */
const withAdRefresh = connect(AdsContext, ({ refreshAdById }) => ({ refreshAdById }));

export default withAdRefresh;
