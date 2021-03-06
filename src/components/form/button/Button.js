import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  blank: {},
  default: { color: '#d9b391', font: '#333' },
  base: { color: '#8c6046', font: '#fff' },
  danger: { color: '#ba0220' },
  success: { color: '#2cb94d' },
  dark: { color: '#000', font: '#fff' },
  gray: { color: '#666', font: '#fff' },
};

const Btn = styled.button`
  padding: 5px 10px;
  background-color: ${props => props.theme.color};
  border-radius: 3px;
  color: ${props => props.theme.font};
`;

const Button = ({ type, kind, children, onClick, className, ariaLabel }) => {
  const thisTheme = theme[kind];
  return (
    <ThemeProvider theme={thisTheme}>
      <Btn
        type={type ? type : 'button'}
        onClick={onClick}
        className={className}
        aria-label={ariaLabel ? ariaLabel : null}
      >
        {children}
      </Btn>
    </ThemeProvider>
  );
};

Button.propTypes = {
  kind: PropTypes.string.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default React.memo(Button);
