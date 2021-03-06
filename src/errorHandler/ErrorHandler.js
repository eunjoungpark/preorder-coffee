import React from 'react';
import Modal from '../components/modal/Modal';
import httpHandler from './httpHandler';

const ErroHandler = WithErrorHandler => {
  return props => {
    const error = httpHandler();
    return (
      <>
        <Modal shown={error ? null : true}>
          {error ? error.message : null}
        </Modal>
        <WithErrorHandler {...props} />
      </>
    );
  };
};

export default ErroHandler;
