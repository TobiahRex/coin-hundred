import { call, put, all } from 'redux-saga/effects';
import bittrexActions from '../../redux/bittrex';
import apiActions from '../../redux/api';

export default function* getMarketSummaries(api) {
  const response = yield call(() => api.getMarketSummaries());
  if (response.ok) {
    yield all([
      put(bittrexActions.receivedMarketSummaries(response.data.result)),
      put(apiActions.apiSuccess()),
    ]);
  } else {
    alert('Could not fetch Bittrex Results');
    console.error(response.problem);
    yield put(apiActions.apiFail(response.problem));
  }
}
