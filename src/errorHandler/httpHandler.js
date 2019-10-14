import { useState, useEffect } from 'react';
import axios from '../libs/api';

export default () => {
  const [error, setError] = useState(null);
  const response = axios.interceptors.response.use(
    res => res,
    error => {
      setError(error);
    },
  );
  const request = axios.interceptors.request.use(req => {
    setError(null);
    return req;
  });

  useEffect(() => {
    return () => {
      axios.interceptors.request.eject(request);
      axios.interceptors.response.eject(response);
    };
  }, [request, response]);
  return error;
};
