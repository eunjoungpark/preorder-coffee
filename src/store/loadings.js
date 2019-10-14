import { createAction, handleActions } from 'redux-actions';
const START_LOADING = 'loadings/START_LOADING';
const FINISH_LOADING = 'loadings/FINISH_LOADING';
const EMPTY_LOADING = 'loadings/EMPTY_LOADING';

export const startLoading = createAction(
  START_LOADING,
  requestType => requestType,
);

export const finishLoading = createAction(
  FINISH_LOADING,
  requestType => requestType,
);

export const emptyLoading = createAction(EMPTY_LOADING);

const initialState = {};

const loadings = handleActions(
  {
    [START_LOADING]: (state, action) => ({ ...state, [action.payload]: true }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
    [EMPTY_LOADING]: state => initialState,
  },
  initialState,
);

export default loadings;
