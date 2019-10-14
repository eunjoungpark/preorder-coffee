import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://preorder-coffee.firebaseio.com',
});

const WEB_KEY = 'AIzaSyDR1SsLdbxCfX-Eb2dnqscsLqF21mhwpHo';

//COFFEE 종류
export const products = () => instance.get('/coffee.json');

//OPTIONS
export const options = () => instance.get('/options.json');

//STORES
export const store = () => instance.get('/store.json');

//WISH ADD
export const addWish = (token, wish) =>
  instance.post(`/wish.json?auth=${token}`, wish);

//WISH UPDATE
export const updateWish = (token, wish) =>
  instance.put(`/wish.json?auth=${token}`, wish);

//WISH UPDATE
export const updateAWish = (token, id, wish) =>
  instance.put(`/wish/${id}.json?auth=${token}`, wish);

//WISH REMOVE
export const removeWish = (token, id) =>
  instance.delete(`/wish/${id}.json?auth=${token}`);

//WISH GET
export const getWish = (token, userId) =>
  instance.get(`/wish.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`);

//MEMU ADD
export const addMenu = (token, menu) =>
  instance.post(`/mymenu.json?auth=${token}`, menu);

//MEMU REMOVE
export const removeMenu = (token, id) =>
  instance.delete(`/mymenu/${id}.json?auth=${token}`);

//MEMU GET
export const getMenu = (token, userId) =>
  instance.get(
    `/mymenu.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`,
  );

//ORDER ADD
export const addOrder = (token, order) =>
  instance.post(`/order.json?auth=${token}`, order);

//ORDER GET
export const getOrder = (token, userId) =>
  instance.get(
    `/order.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`,
  );

//SIGNUP & SIGNIN
const signup = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${WEB_KEY}`;
const signin = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_KEY}`;

export const auth = userInfo => {
  const user = {
    email: userInfo.email,
    password: userInfo.password,
    returnSecureToken: true,
  };
  return axios.post(userInfo.type === 'signup' ? signup : signin, user);
};

export default instance;
