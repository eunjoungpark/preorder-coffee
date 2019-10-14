import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import produce from 'immer';

import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

const INIT_AUTH = 'auth/INIT_AUTH';
export const SET_AUTH = 'auth/SET_AUTH';
const REMOVE_AUTH = 'auth/REMOVE_AUTH';
const ACCESS_AUTH = 'auth/ACCESS_AUTH';
const INIT_SUCCESS = 'auth/INIT_SUCCESS';

export const initAuth = createAction(INIT_AUTH, userInfo => userInfo);
export const removeAuth = createAction(REMOVE_AUTH);
export const accessAuth = createAction(ACCESS_AUTH);
export const initSuccess = createAction(INIT_SUCCESS);

const fetchAuthAsync = function*({ payload: userInfo }) {
  yield put(startLoading(SET_AUTH));
  try {
    const response = yield call(api.auth, userInfo);
    yield put({
      type: SET_AUTH,
      payload: { data: response.data, status: response.status },
    });
  } catch (e) {
    yield put(errorMessage({ action: SET_AUTH, error: e.response.data.error }));
  }
  yield put(finishLoading(SET_AUTH));
};

export const authAsync = function*() {
  yield takeLatest(INIT_AUTH, fetchAuthAsync);
};

const initialState = {
  idToken: null,
  localId: null,
  expiresDate: null,
  success: null,
};

const auth = handleActions(
  {
    [SET_AUTH]: (state, { payload }) =>
      produce(state, draft => {
        const expiresDate = new Date(new Date().getTime() + 600000); //10분 토큰시간
        localStorage.setItem('idToken', payload.data.idToken);
        localStorage.setItem('localId', payload.data.localId);
        localStorage.setItem('expiresDate', expiresDate);
        draft.idToken = payload.data.idToken;
        draft.localId = payload.data.localId;
        draft.expiresDate = expiresDate;
        draft.success = payload.status >= 200 && payload.status < 300;
      }),
    [REMOVE_AUTH]: state =>
      produce(state, draft => {
        draft.idToken = null;
        draft.localId = null;
        draft.expiresDate = null;
        localStorage.removeItem('idToken');
        localStorage.removeItem('localId');
        localStorage.removeItem('expiresDate');
      }),
    [ACCESS_AUTH]: (state, { payload: expiresIn }) =>
      produce(state, draft => {
        const expiresDate = new Date(new Date().getTime() + expiresIn);
        draft.idToken = localStorage.getItem('idToken');
        draft.localId = localStorage.getItem('localId');
        draft.expiresDate = expiresDate;
        localStorage.setItem('expiresDate', expiresDate);
      }),
    [INIT_SUCCESS]: state =>
      produce(state, draft => {
        draft.success = null;
      }),
  },
  initialState,
);

export default auth;
