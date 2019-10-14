import { createAction, handleActions } from 'redux-actions';
import { delay, call, put, takeLatest } from 'redux-saga/effects';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';
import produce from 'immer';

/* TYPE 정의 */
const INIT_PRODUCTS = 'product/INIT_PRODUCTS';
export const SET_PRODUCTS = 'product/SET_PRODUCTS';
const INIT_PRODUCT = 'product/INIT_PRODUCT';
const SET_PRODUCT = 'product/SET_PRODUCT';

/* ACTION 정의 */
export const initProducts = createAction(INIT_PRODUCTS);
export const initProduct = createAction(INIT_PRODUCT);
export const onSetProduct = createAction(SET_PRODUCT, payload => payload);

/* 비동기 정의 */
const fetchListAsync = function*() {
  yield put(startLoading(SET_PRODUCTS));
  try {
    const response = yield call(api.products);
    yield delay(500);
    yield put({
      type: SET_PRODUCTS,
      payload: response.data,
    });
  } catch (e) {
    yield put(errorMessage({ action: SET_PRODUCTS, message: e }));
  }
  yield put(finishLoading(SET_PRODUCTS));
};

/* 비동기호출 정의 */
export const productListAsync = function*() {
  yield takeLatest(INIT_PRODUCTS, fetchListAsync);
};

/* 초기값 정의 */
const initialState = {
  lists: null,
  product: null,
};

/* REDUCER 정의 */
const product = handleActions(
  {
    [SET_PRODUCTS]: (state, { payload: products }) =>
      produce(state, draft => {
        draft.lists = products;
      }),
    [INIT_PRODUCT]: (state, action) =>
      produce(state, draft => {
        draft.product = null;
      }),
    [SET_PRODUCT]: (state, { payload: { type, kind } }) =>
      produce(state, draft => {
        let sizes = {};
        const product = state.lists[type][kind];
        if (kind === 'espresso') {
          sizes = {
            Solo: product.sizes['Solo'],
            Doppio: product.sizes['Doppio'],
          };
        } else {
          sizes = {
            Tall: product.sizes['Tall'],
            Grande: product.sizes['Grande'],
            Venti: product.sizes['Venti'],
          };
        }
        product.sizes = sizes;
        draft.product = product;
      }),
  },
  initialState,
);

export default product;
