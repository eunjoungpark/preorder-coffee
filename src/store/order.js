import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest, throttle } from 'redux-saga/effects';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';
import { produce } from 'immer';

export const ORDER_LIST = 'orders/ORDER_LIST';
const INIT_ORDER_LIST = 'orders/INIT_ORDER_LIST';
const SET_ORDER_LIST = 'orders/SET_ORDER_LIST';
export const ADD_ORDER_LIST = 'orders/ADD_ORDER_LIST';

export const initOrderList = createAction(INIT_ORDER_LIST, payload => payload);
export const addOrderList = createAction(ADD_ORDER_LIST, payload => payload);

const fetchOrderAsync = function*({ payload }) {
  yield put(startLoading(ORDER_LIST));
  try {
    const response = yield call(
      api.getOrder,
      payload.token,
      payload.userId,
      payload.page,
      payload.limit,
    );
    yield put({ type: SET_ORDER_LIST, payload: response.data });
  } catch (e) {
    yield put(errorMessage({ action: ORDER_LIST, message: e }));
  }
  yield put(finishLoading(ORDER_LIST));
};

const addOrderAsync = function*({ payload }) {
  yield put(startLoading(ADD_ORDER_LIST));
  try {
    const response = yield call(
      api.addOrder,
      payload.token,
      payload.userId,
      payload.order,
    );
    yield put(finishLoading(ADD_ORDER_LIST));
  } catch (e) {
    yield put(errorMessage({ action: ADD_ORDER_LIST, message: e }));
  }
};

export const orderAsync = function*() {
  yield takeLatest(INIT_ORDER_LIST, fetchOrderAsync);
  yield takeLatest(ADD_ORDER_LIST, addOrderAsync);
};

const initialState = {
  lists: [],
  endAt: null,
  finish: false,
};

const order = handleActions(
  {
    [SET_ORDER_LIST]: (state, { payload: orders }) =>
      produce(state, draft => {
        let orderList = Object.keys(orders)
          .map((o, index) => orders[o])
          .reverse();
        if (draft.endAt !== null) {
          orderList = orderList.filter((o, index) => index !== 0);
        }
        draft.lists = [...draft.lists, ...orderList];
        draft.endAt = Object.keys(orders)[0];
        draft.finish = Object.keys(orders).length < 7;
      }),
  },
  initialState,
);

export default order;
