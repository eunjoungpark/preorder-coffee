import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

const ERROR_MESSAGE = 'error/ERROR_MESSAGE';
const EMPTY_MESSAGE = 'error/EMPTY_MESSAGE';

export const errorMessage = createAction(ERROR_MESSAGE, payload => payload);
export const emptyMessage = createAction(EMPTY_MESSAGE, type => type);
const initialState = {};

const error = handleActions(
  {
    [ERROR_MESSAGE]: (state, { payload }) =>
      produce(state, draft => {
        draft[payload.action] = payload.error;
      }),
    [EMPTY_MESSAGE]: (state, { payload: type }) =>
      produce(state, draft => {
        draft[type] = null;
      }),
  },
  initialState,
);

export default error;
