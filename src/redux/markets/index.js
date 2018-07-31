import { createActions, createReducer } from 'reduxsauce';

import immutable from 'seamless-immutable';

const { Types, Creators } = createActions({
  getMarketSummaries: null,
  receivedMarketSummaries: ['summaries'],
});

export default Creators;
export const MarketTypes = Types;
export const INITIAL_STATE = immutable([]);

const receivedMarketSummaries = (state, { summaries }) => summaries || [];

export const marketReducer = createReducer(INITIAL_STATE, {
  [Types.RECEIVED_MARKET_SUMMARIES]: receivedMarketSummaries,
});
