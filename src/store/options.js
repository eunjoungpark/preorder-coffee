import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import produce from 'immer';
import * as api from '../libs/api';
import { startLoading, finishLoading } from './loadings';
import { errorMessage } from './error';

/*
  음료 퍼스널 옵션 리듀서
*/
const INIT_OPTIONS = 'options/INIT_OPTIONS';
export const SET_OPTIONS = 'options/SET_OPTIONS';
const SET_PRICE = 'options/SET_PRICE';
const SET_ICE = 'options/SET_ICE';
const SET_WATER = 'options/SET_WATER';
const SET_MILK = 'options/SET_MILK';
const SET_SHOT = 'options/SET_SHOT';
const SET_SYRUP = 'options/SET_SYRUP';
const SET_SYRUP_MOCHA = 'options/SET_SYRUP_MOCHA';
const SET_SYRUP_HAZELNUT = 'options/SET_SYRUP_HAZELNUT';
const SET_SYRUP_CARAMEL = 'options/SET_SYRUP_CARAMEL';
const SET_SYRUP_VANILLA = 'options/SET_SYRUP_VANILLA';
const SET_WHIPPING = 'options/SET_WHIPPING';
const SET_COUNT = 'options/SET_COUNT';
const SET_SIZE = 'options/SET_SIZE';
const SET_CUP = 'options/SET_CUP';
const SET_TYPE = 'options/SET_TYPE';
const SET_TOTAL = 'options/SET_TOTAL';
const SET_MESSAGES = 'options/SET_MESSAGES';

export const initOptions = createAction(INIT_OPTIONS);
export const onSetPrice = createAction(SET_PRICE, price => price);
export const onSetIce = createAction(SET_ICE, ice => ice);
export const onSetWater = createAction(SET_ICE, water => water);
export const onSetMilk = createAction(SET_MILK, milk => milk);
export const onSetShot = createAction(SET_SHOT, shot => shot);
export const onSetSyrup = createAction(SET_SYRUP, syrup => syrup);
export const onSetSyrupMocha = createAction(SET_SYRUP_MOCHA, mocha => mocha);
export const onSetSyrupHazelnut = createAction(
  SET_SYRUP_HAZELNUT,
  hazelnut => hazelnut,
);
export const onSetSyrupCaramel = createAction(
  SET_SYRUP_CARAMEL,
  caramel => caramel,
);
export const onSetSyrupVanilla = createAction(
  SET_SYRUP_VANILLA,
  vanilla => vanilla,
);
export const onSetWhipping = createAction(SET_WHIPPING, whipping => whipping);
export const onSetCount = createAction(SET_COUNT, count => count);
export const onSetTotal = createAction(SET_TOTAL, total => total);
export const onSetSize = createAction(SET_SIZE, size => size);
export const onSetCup = createAction(SET_CUP, cup => cup);
export const onSetType = createAction(SET_TYPE, type => type);
export const onSetMessages = createAction(SET_MESSAGES, messages => messages);

function* fetchOPtionAsync() {
  yield put(startLoading(SET_OPTIONS));
  try {
    const response = yield call(api.options);
    yield put({
      type: SET_OPTIONS,
      payload: response.data,
    });
  } catch (e) {
    yield put(errorMessage({ action: SET_OPTIONS, message: e }));
  }
  yield put(finishLoading(SET_OPTIONS));
}

export function* optionsAsync() {
  yield takeLatest(INIT_OPTIONS, fetchOPtionAsync);
}

export const types = {
  hot: 'HOT',
  iced: 'ICED',
};

export const cups = {
  mug: '머그컵',
  disposable: '일회용',
  individual: '개인컵',
};

export const syrup = {
  mocha: '모카 시럽',
  hazelnut: '헤이즐넛 시럽',
  caramel: '카라멜 시럽',
  vanilla: '바닐라 시럽',
};

export const decaffeine = {
  none: '디카페인',
  half: '1/2 디카페인',
};

export const water = {
  small: '적게',
  normal: '보통',
  large: '많이',
};

export const ice = {
  small: '적게',
  normal: '보통',
  large: '많이',
};

export const milk = {
  kind: {
    milk: '일반 우유',
    free: '무지방',
    row: '저지방',
    soy: '두유',
  },
  volume: {
    small: '적게',
    normal: '보통',
    large: '많이',
  },
};

export const whipping = {
  small: '적게',
  normal: '보통',
  large: '많이',
};

const initialState = {};

const options = handleActions(
  {
    [SET_OPTIONS]: (state, { payload: data }) => data,
    [SET_PRICE]: (state, { payload: price }) =>
      produce(state, draft => {
        draft.price = price;
      }),
    [SET_ICE]: (state, { payload: ice }) =>
      produce(state, draft => {
        draft.ice = ice;
      }),
    [SET_WATER]: (state, { payload: water }) =>
      produce(state, draft => {
        draft.water = water;
      }),
    [SET_MILK]: (state, { payload: milk }) =>
      produce(state, draft => {
        draft.milk = milk;
      }),
    [SET_SHOT]: (state, { payload: shot }) =>
      produce(state, draft => {
        draft.shot = shot;
      }),
    [SET_SYRUP]: (state, { payload: syrup }) =>
      produce(state, draft => {
        draft.syrup = syrup;
      }),
    [SET_WHIPPING]: (state, { payload: whipping }) =>
      produce(state, draft => {
        draft.whipping = whipping;
      }),
    [SET_COUNT]: (state, { payload: count }) =>
      produce(state, draft => {
        draft.count = count;
      }),
    [SET_CUP]: (state, { payload: cup }) =>
      produce(state, draft => {
        draft.cup = cup;
      }),
    [SET_SIZE]: (state, { payload: size }) =>
      produce(state, draft => {
        draft.size = size;
      }),
    [SET_TYPE]: (state, { payload: type }) =>
      produce(state, draft => {
        draft.type = type;
      }),
    [SET_TOTAL]: (state, { payload: total }) =>
      produce(state, draft => {
        draft.total = total;
      }),
    [SET_MESSAGES]: (state, { payload: messages }) =>
      produce(state, draft => {
        Object.keys(messages).forEach(message => {
          draft.messages[message] = messages[message];
        });
      }),
  },
  initialState,
);

export default options;
