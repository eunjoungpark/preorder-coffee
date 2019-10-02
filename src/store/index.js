import { combineReducers } from 'redux';
import product, { productListAsync } from './product';
import loadings from './loadings';
import error from './error';
import options, { optionsAsync } from './options';
import wish from './wish';
import { all } from 'redux-saga/effects';

const rootReducers = combineReducers({
  product,
  loadings,
  error,
  options,
  wish,
});

export function* rootSaga() {
  yield all([productListAsync(), optionsAsync()]);
}

export default rootReducers;
