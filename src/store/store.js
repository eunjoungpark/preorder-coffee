import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { produce } from 'immer';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

const INIT_STORE = 'store/INIT_STORE';
export const GET_STORES = 'store/GET_STORES';
const SET_STORE = 'store/SET_STORE';

export const initStore = createAction(INIT_STORE);
export const setStore = createAction(SET_STORE, store => store);

const fetchStoreAsync = function*() {
  yield put(startLoading(GET_STORES));
  try {
    const response = yield call(api.store);
    yield put({
      type: GET_STORES,
      payload: response.data,
    });
  } catch (e) {
    yield put(errorMessage({ action: GET_STORES, message: e }));
  }
  yield put(finishLoading(GET_STORES));
};

export const storeAsync = function*() {
  yield takeLatest(INIT_STORE, fetchStoreAsync);
};

const initialState = {
  stores: null,
  selected: null,
};

const store = handleActions(
  {
    [GET_STORES]: (state, { payload: stores }) =>
      produce(state, draft => {
        draft.stores = stores;
      }),
    [SET_STORE]: (state, { payload: store }) =>
      produce(state, draft => {
        draft.selected = store;
      }),
  },
  initialState,
);

export default store;
