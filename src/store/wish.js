import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

/*
  담기기능 리듀서
*/
const ADD_WISH_LIST = 'wish/ADD_WISH_LIST';
const REMOVE_WISH_LIST = 'wish/REMOVE_WISH_LIST';

// export const getWishList = createAction(GET_WISH_LIST, lists => lists);
export const addWishList = createAction(ADD_WISH_LIST, wish => wish);
export const removeWishList = createAction(REMOVE_WISH_LIST, id => id);

const initialState = [];

const wish = handleActions(
  {
    [ADD_WISH_LIST]: (state, { action: wish }) =>
      produce(state, draft => {
        draft.push(wish);
      }),
    [REMOVE_WISH_LIST]: (state, { action: id }) =>
      produce(state, draft => {
        const id = draft.findIndex(wish => wish.id === id);
        draft.splice(id, 1);
      }),
  },
  initialState,
);

export default wish;
