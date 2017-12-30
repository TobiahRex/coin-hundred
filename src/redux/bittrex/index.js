import { createActions, createReducer } from 'reduxsauce';
import immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  getMarketSummaries: null,
  receivedMarketSummaries: ['summaries'],
});

export const BittrexTypes = Types;
export default Creators;
export const INITIAL_STATE = immutable([]);

const receivedMarketSummaries = (state, { summaries }) => summaries || [];

export const bittrexReducer = createReducer(INITIAL_STATE, {
  [Types.RECEIVED_MARKET_SUMMARIES]: receivedMarketSummaries,
});
