import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

export const ORDER_LIST = 'orders/ORDER_LIST';
const INIT_ORDER_LIST = 'orders/INIT_ORDER_LIST';
const SET_ORDER_LIST = 'orders/SET_ORDER_LIST';
const ADD_ORDER_LIST = 'orders/ADD_ORDER_LIST';

export const initOrderList = createAction(INIT_ORDER_LIST, auth => auth);
export const addOrderList = createAction(ADD_ORDER_LIST, payload => payload);

const fetchOrderAsync = function*({ payload: auth }) {
  yield put(startLoading(ORDER_LIST));
  try {
    const response = yield call(api.getOrder, auth.token, auth.userId);
    yield put({ type: SET_ORDER_LIST, payload: response.data });
  } catch (e) {
    yield put(errorMessage({ action: ORDER_LIST, message: e }));
  }
  yield put(finishLoading(ORDER_LIST));
};

const addOrderAsync = function*({ payload }) {
  try {
    yield call(api.addOrder, payload.token, payload.order);
    yield put({
      type: INIT_ORDER_LIST,
      payload: {
        token: payload.token,
        userId: payload.userId,
      },
    });
  } catch (e) {
    yield put(errorMessage({ action: ADD_ORDER_LIST, message: e }));
  }
};

export const orderAsync = function*() {
  yield takeLatest(INIT_ORDER_LIST, fetchOrderAsync);
  yield takeLatest(ADD_ORDER_LIST, addOrderAsync);
};

const initialState = {};

const order = handleActions(
  {
    [SET_ORDER_LIST]: (state, { payload: orders }) => orders,
  },
  initialState,
);

export default order;
