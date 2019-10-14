import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

/*
  위시리스트 리듀서
*/
export const WISH_LIST = 'wish/WISH_LIST';
const INIT_WISH_LIST = 'wish/INIT_WISH_LIST';
const EMPTY_WISH_LIST = 'wish/EMPTY_WISH_LIST';
const SET_WISH_LIST = 'wish/SET_WISH_LIST';
const UPDATE_WISH_LIST = 'wish/UPDATE_WISH_LIST';
const CHECKED_WISH = 'wish/CHECKED_WISH';
export const ADD_WISH = 'wish/ADD_WISH';
export const REMOVE_WISH = 'wish/REMOVE_WISH';

export const initWishList = createAction(INIT_WISH_LIST, auth => auth);
export const emptyWishList = createAction(EMPTY_WISH_LIST);
export const setWishList = createAction(SET_WISH_LIST, lists => lists);
export const updateWishList = createAction(
  UPDATE_WISH_LIST,
  payload => payload,
);
export const addWish = createAction(ADD_WISH, wish => wish);
export const checkedWish = createAction(CHECKED_WISH, payload => payload);
export const removeWish = createAction(REMOVE_WISH, payload => payload);

const fetchWishAsync = function*({ payload: auth }) {
  yield put(startLoading(WISH_LIST));

  try {
    const response = yield call(api.getWish, auth.token, auth.userId);
    yield put({ type: SET_WISH_LIST, payload: response.data });
  } catch (e) {
    yield put(errorMessage({ action: WISH_LIST, message: e }));
  }
  yield put(finishLoading(WISH_LIST));
};

const addWishAsync = function*({ payload }) {
  yield put(startLoading(ADD_WISH));
  try {
    yield call(api.addWish, payload.token, payload.wish);
    yield put({
      type: INIT_WISH_LIST,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: ADD_WISH, message: e }));
  }
  yield put(finishLoading(ADD_WISH));
};

const updateWishAsync = function*({ payload }) {
  try {
    yield call(api.updateWish, payload.token, payload.wish);
    yield put({
      type: INIT_WISH_LIST,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: UPDATE_WISH_LIST, message: e }));
  }
};

const updateAWishAsync = function*({ payload }) {
  try {
    yield call(api.updateAWish, payload.token, payload.id, payload.wish);
    yield put({
      type: INIT_WISH_LIST,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: CHECKED_WISH, message: e }));
  }
};

const removeWishAsync = function*({ payload }) {
  yield put(startLoading(REMOVE_WISH));
  try {
    yield call(api.removeWish, payload.token, payload.id);
    yield put({
      type: INIT_WISH_LIST,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: REMOVE_WISH, message: e }));
  }
  yield put(finishLoading(REMOVE_WISH));
};

export const wishAsync = function*() {
  yield takeLatest(INIT_WISH_LIST, fetchWishAsync);
  yield takeEvery(ADD_WISH, addWishAsync);
  yield takeEvery(REMOVE_WISH, removeWishAsync);
  yield takeEvery(CHECKED_WISH, updateAWishAsync);
  yield takeEvery(UPDATE_WISH_LIST, updateWishAsync);
};

const initialState = {};

const wish = handleActions(
  {
    [SET_WISH_LIST]: (state, { payload: lists }) => lists,
    [EMPTY_WISH_LIST]: state => initialState,
  },
  initialState,
);

export default wish;
