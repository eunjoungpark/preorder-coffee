import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';
import Backdrop from '../backdrop/Backdrop';

const ModalContents = styled.div`
  position: fixed;
  z-index: 10;
  .modalBox {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 300px;
    padding: 20px;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: 100;
    line-height: 1.5;
    text-align: center;
    h1 {
      margin-bottom: 20px;
      font-weight: bold;
    }
    button {
      margin: 10px 5px;
    }
  }
`;

const Modal = ({ children, shown, onClickHandler }) => {
  const modalRef = useRef(null);
  const onChangePageHandler = useCallback(() => {
    modalRef.current.hidden = true;
  }, [shown]);

  const onClickParentHandler = () => {
    onClickHandler();
    onChangePageHandler();
  };
  return (
    <>
      <ModalContents hidden={shown} ref={modalRef}>
        <Backdrop
          onClick={onClickHandler ? onClickParentHandler : onChangePageHandler}
        />
        <div className="modalBox">{children}</div>
      </ModalContents>
    </>
  );
};

export default React.memo(Modal);
