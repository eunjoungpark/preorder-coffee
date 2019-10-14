import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import produce from 'immer';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

export const MY_MENU = 'mymenu/MY_MENU';
export const ADD_MY_MENU = 'mymenu/ADD_MY_MENU';
export const REMOVE_MY_MENU = 'mymenu/REMOVE_MY_MENU';
const INIT_MY_MENU = 'mymenu/INIT_MY_MENU';
const EMPTY_MY_MENU = 'mymenu/EMPTY_MY_MENU';
const SET_MY_MENU = 'mymenu/SET_MY_MENU';
const SET_MENU_COUNT = 'mymenu/SET_MENU_COUNT';
const SET_MENU = 'mymenu/SET_MENU';

export const initMenu = createAction(INIT_MY_MENU, auth => auth);
export const emptyMenu = createAction(EMPTY_MY_MENU);
export const addMenu = createAction(ADD_MY_MENU, payload => payload);
export const removeMenu = createAction(REMOVE_MY_MENU, payload => payload);
export const setMenuCount = createAction(SET_MENU_COUNT, count => count);
export const setMenu = createAction(SET_MENU, id => id);

const fetchMenuAsync = function*({ payload: auth }) {
  yield put(startLoading(MY_MENU));

  try {
    const response = yield call(api.getMenu, auth.token, auth.userId);
    yield put({ type: SET_MY_MENU, payload: response.data });
  } catch (e) {
    yield put(errorMessage({ action: MY_MENU, message: e }));
  }
  yield put(finishLoading(MY_MENU));
};

const addMenuAsync = function*({ payload }) {
  yield put(startLoading(ADD_MY_MENU));
  try {
    yield call(api.addMenu, payload.token, payload.menu);
    yield put({
      type: INIT_MY_MENU,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: ADD_MY_MENU, message: e }));
  }
  yield put(finishLoading(ADD_MY_MENU));
};

const removeMenuAsync = function*({ payload }) {
  yield put(startLoading(REMOVE_MY_MENU));

  try {
    yield call(api.removeMenu, payload.token, payload.id);
    yield put({
      type: INIT_MY_MENU,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: REMOVE_MY_MENU, message: e }));
  }
  yield put(finishLoading(REMOVE_MY_MENU));
};

export const menuAsync = function*() {
  yield takeLatest(INIT_MY_MENU, fetchMenuAsync);
  yield takeEvery(ADD_MY_MENU, addMenuAsync);
  yield takeEvery(REMOVE_MY_MENU, removeMenuAsync);
};

const initialState = {
  lists: null,
  menu: null,
};

const mymenu = handleActions(
  {
    [SET_MY_MENU]: (state, { payload: wish }) =>
      produce(state, draft => {
        draft.lists = wish;
      }),
    [SET_MENU_COUNT]: (state, { payload: count }) =>
      produce(state, draft => {
        draft.menu.count = count;
      }),
    [SET_MENU]: (state, { payload: id }) =>
      produce(state, draft => {
        draft.menu = draft.lists[id];
      }),
    [EMPTY_MY_MENU]: state =>
      produce(state, draft => {
        draft.lists = null;
        draft.menu = null;
      }),
  },
  initialState,
);

export default mymenu;
