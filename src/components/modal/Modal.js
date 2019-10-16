import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ModalContents } from '../common';
import Backdrop from '../backdrop/Backdrop';

const Modal = ({ children, shown, ariaLive, onClickHandler }) => {
  const modalRef = useRef(null);

  const ModalWrap = styled.div`
    position: fixed;
    z-index: 10;
  `;

  const onChangePageHandler = useCallback(() => {
    modalRef.current.hidden = true;
  }, [shown]);

  const onClickParentHandler = () => {
    onClickHandler();
    onChangePageHandler();
  };
  return (
    <>
      <ModalWrap
        hidden={shown}
        ref={modalRef}
        role="alert"
        aria-live={ariaLive ? ariaLive : null}
      >
        <Backdrop
          onClick={onClickHandler ? onClickParentHandler : onChangePageHandler}
        />
        <ModalContents>{children}</ModalContents>
      </ModalWrap>
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  shown: PropTypes.bool,
  onClickHandler: PropTypes.func,
};

export default React.memo(Modal);
