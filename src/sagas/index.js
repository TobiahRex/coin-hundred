import { takeLatest, all } from 'redux-saga/effects';
import thingAPI from '../services/things';
import bittrexAPI from '../services/bittrex';

// ----- Sagas ----- //
import GetAllThings from './thing/getAllThings';
import CreateThing from './thing/createThing';
import EditThing from './thing/editThing';
import RemoveThing from './thing/removeThing';

import GetMarketSummaries from './bittrex/getMarketSummaries';

// ----- Types ----- //
import { ThingTypes } from '../redux/thing';
import { BittrexTypes } from '../redux/bittrex';

const thingApi = thingAPI.createAPI();
const bittrexApi = bittrexAPI.createAPI();

export default function* rootSaga() {
  yield all([
    takeLatest(ThingTypes.GET_ALL_THINGS, GetAllThings, thingApi),
    takeLatest(ThingTypes.CREATE_THING, CreateThing, thingApi),
    takeLatest(ThingTypes.REMOVE_THING, RemoveThing, thingApi),
    takeLatest(ThingTypes.EDIT_THING, EditThing, thingApi),
    takeLatest(BittrexTypes.GET_MARKET_SUMMARIES, GetMarketSummaries, bittrexApi),
  ]);
}
