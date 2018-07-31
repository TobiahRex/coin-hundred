import { call, put, all } from 'redux-saga/effects';
import bittrexActions from '../../redux/bittrex';
import apiActions from '../../redux/api';

export default function* getMarketSummaries(api) {
  const response = yield call(() => api.getPrices());
  // const response = yield call(() => api.getMarketSummaries());
  console.log('response: ', response);
  if (response.ok) {
    yield all([
      put(bittrexActions.receivedMarketSummaries(response.data)),
      put(apiActions.apiSuccess()),
    ]);
  } else {
    alert('Could not fetch Bittrex Results');
    console.error(response.problem);
    yield put(apiActions.apiFail(response.problem));
  }
}
