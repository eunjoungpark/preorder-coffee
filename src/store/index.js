import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import loadings from './loadings';
import error from './error';
import product, { productListAsync } from './product';
import options, { optionsAsync } from './options';
import auth, { authAsync } from './auth';
import store, { storeAsync } from './store';
import wish, { wishAsync } from './wish';
import mymenu, { menuAsync } from './mymenu';
import order, { orderAsync } from './order';

const rootReducers = combineReducers({
  product,
  loadings,
  error,
  options,
  wish,
  auth,
  store,
  mymenu,
  order,
});

export function* rootSaga() {
  yield all([
    productListAsync(),
    optionsAsync(),
    authAsync(),
    storeAsync(),
    wishAsync(),
    menuAsync(),
    orderAsync(),
  ]);
}

export default rootReducers;
