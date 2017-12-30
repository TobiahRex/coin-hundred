import { call, put, all } from 'redux-saga/effects';
import bittrexActions from '../../redux/bittrex';
import apiActions from '../../redux/api';

export default function* getMarketSummaries(api) {
  const response = yield call(() => api.getMarketSummaries());

  if (response.ok) {
    yield all([
      put(bittrexActions.bittrexSuccess(response.data)),
      put(apiActions.apiSuccess()),
    ]);
  } else {
    yield put(apiActions.apiFail(response.problem));
  }
}
