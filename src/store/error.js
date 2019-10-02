import { createAction, handleActions } from 'redux-actions';

const START_ERROR = 'error/START_ERROR';
const FINISH_ERROR = 'error/FINISH_ERROR';

export const startError = createAction(START_ERROR, errorType => errorType);
export const finishError = createAction(FINISH_ERROR, errorType => errorType);

const initialState = {};

const error = handleActions(
  {
    [START_ERROR]: (state, action) => ({ ...state, [action.payload]: true }),
    [FINISH_ERROR]: (state, action) => ({ ...state, [action.payload]: false }),
  },
  initialState,
);

export default error;
