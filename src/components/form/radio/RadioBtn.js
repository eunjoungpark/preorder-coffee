import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  default: { color: '#260f07' },
  hot: { color: '#ba0220' },
  cold: { color: '#36a2cf' },
};

const Radio = styled.span`
  position: relative;
  display: inline-block;
  margin: 0 5px;
  text-align: center;
  label {
    display: block;
    border-radius: 3px;
    padding: 10px;
    border: 1px solid ${props => props.theme.color};
    color: ${props => props.theme.color};
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  input:checked ~ label {
    background: ${props => props.theme.color};
    color: #fff;
  }
`;

const RadioBtn = ({
  type,
  id,
  name,
  value,
  children,
  checked,
  clickHander,
  onClick,
}) => {
  const thisTheme = theme[type];
  return (
    <ThemeProvider theme={thisTheme}>
      <Radio>
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          defaultChecked={checked}
        />
        <label htmlFor={id} onClick={onClick}>
          {children}
        </label>
      </Radio>
    </ThemeProvider>
  );
};

export default React.memo(RadioBtn);
