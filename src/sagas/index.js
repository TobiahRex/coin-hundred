import { takeLatest, all } from 'redux-saga/effects';
import thingAPI from '../services/things';

// ----- Sagas ----- //
import GetAllThings from './thing/getAllThings';
import CreateThing from './thing/createThing';
import EditThing from './thing/editThing';
import RemoveThing from './thing/removeThing';

// ----- Types ----- //
import { ThingTypes } from '../redux/thing';

const api = thingAPI.createAPI();

export default function* rootSaga() {
  yield all([
    takeLatest(ThingTypes.GET_ALL_THINGS, GetAllThings, api),
    takeLatest(ThingTypes.CREATE_THING, CreateThing, api),
    takeLatest(ThingTypes.REMOVE_THING, RemoveThing, api),
    takeLatest(ThingTypes.EDIT_THING, EditThing, api),
  ]);
}
