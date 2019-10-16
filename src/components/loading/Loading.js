import React from 'react';
import './loading.css';

const Loading = () => {
  return (
    <div className="lds-spinner" role="alert" aria-live="assertive">
      <div clasName="hidden">진행 중입니다.</div>
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
