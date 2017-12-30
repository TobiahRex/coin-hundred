import { createActions, createReduce } from 'reduxsauce';
import Immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  getMarketSummaries: ['summaries'],
});

export const BittrexTypes = Types;
export default Creators;
export const INITIAL_STATE = Immutable([]);
