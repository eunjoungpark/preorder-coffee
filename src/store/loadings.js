import { createAction, handleActions } from 'redux-actions';
import { produce } from 'immer';
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

export const emptyLoading = createAction(EMPTY_LOADING, type => type);

const initialState = {};

const loadings = handleActions(
  {
    [START_LOADING]: (state, action) => ({ ...state, [action.payload]: true }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false,
    }),
    [EMPTY_LOADING]: (state, { payload: type }) =>
      produce(state, draft => {
        draft[type] = null;
      }),
  },
  initialState,
);

export default loadings;
