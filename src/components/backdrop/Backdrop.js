import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BackdropWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 98;
`;

const Backdrop = ({ onClick }) => {
  return <BackdropWrap onClick={onClick} />;
};

Backdrop.propTypes = {
  onClick: PropTypes.func,
};

export default React.memo(Backdrop);
