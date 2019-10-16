import React from 'react';
import './loading.css';

const Loading = () => {
  return (
    <div
      className="lds-spinner"
      role="alert"
      aria-live="assertive"
      aria-label="기다려 주세요."
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default React.memo(Loading);
