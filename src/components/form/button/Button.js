import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  blank: {},
  default: { color: '#d9b391', font: '#333' },
  base: { color: '#8c6046', font: '#fff' },
  danger: { color: '#ba0220' },
  success: { color: '#2cb94d' },
};

const Btn = styled.button`
  padding: 5px 10px;
  font-size: 20px;
  background-color: ${props => props.theme.color};
  border-radius: 3px;
  color: ${props => props.theme.font};
`;

const Button = ({ type, kind, children, onClick }) => {
  const thisTheme = theme[kind];
  return (
    <ThemeProvider theme={thisTheme}>
      <Btn type={type ? type : 'button'} onClick={onClick}>
        {children}
      </Btn>
    </ThemeProvider>
  );
};

export default React.memo(Button);
