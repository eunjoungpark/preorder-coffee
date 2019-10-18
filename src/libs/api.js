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
export const addWish = (token, userId, wish) =>
  instance.post(`/wish/${userId}.json?auth=${token}`, wish);

//WISH UPDATE
export const updateWish = (token, userId, wish) =>
  instance.put(`/wish/${userId}.json?auth=${token}`, wish);

//WISH UPDATE
export const updateAWish = (token, userId, id, wish) =>
  instance.put(`/wish/${userId}/${id}.json?auth=${token}`, wish);

//WISH REMOVE
export const removeWish = (token, userId, id) =>
  instance.delete(`/wish/${userId}/${id}.json?auth=${token}`);

//WISH GET
export const getWish = (token, userId) =>
  instance.get(`/wish/${userId}.json?auth=${token}&orderBy="date"`);

//MEMU ADD
export const addMenu = (token, userId, menu) =>
  instance.post(`/mymenu/${userId}.json?auth=${token}`, menu);

//MEMU REMOVE
export const removeMenu = (token, userId, id) =>
  instance.delete(`/mymenu/${userId}/${id}.json?auth=${token}`);

//MEMU GET
export const getMenu = (token, userId) =>
  instance.get(`/mymenu/${userId}.json?auth=${token}&orderBy="date"`);

//ORDER ADD
export const addOrder = (token, userId, order) =>
  instance.post(`/order/${userId}.json?auth=${token}`, order);

//ORDER GET
export const getOrder = (token, userId, page, limit) => {
  if (page === null) {
    return instance.get(
      `/order/${userId}.json?auth=${token}&orderBy="$key"&limitToLast=${limit}`,
    );
  } else {
    return instance.get(
      `/order/${userId}.json?auth=${token}&orderBy="$key"&endAt="${page}"&limitToLast=${limit}`,
    );
  }
};
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
