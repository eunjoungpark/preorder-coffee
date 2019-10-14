export const checkEmail = address => {
  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return pattern.test(address);
};

export const checkPassword = password => {
  const pattern = /[a-z!@#$%^&0-9]{6,}?/;
  return pattern.test(password);
};

export const commas = val => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
