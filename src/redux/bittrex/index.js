import { createActions, createReducer } from 'reduxsauce';
import immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  getMarketSummaries: ['summaries'],
});

export const BittrexTypes = Types;
export default Creators;
export const INITIAL_STATE = immutable([]);

const getMarketSummaries = (state, { summaries }) => summaries || [];

export const bittrexReducer = createReducer(INITIAL_STATE, {
  [Types.GET_MARKET_SUMMARIES]: getMarketSummaries,
});
