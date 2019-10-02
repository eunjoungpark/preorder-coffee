import axios from 'axios';

//COFFEE 종류
export const products = () =>
  axios.get('https://preorder-coffee.firebaseio.com/coffee.json');

//OPTIONS
export const options = () =>
  axios.get('https://preorder-coffee.firebaseio.com/options.json');
