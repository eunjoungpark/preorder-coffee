import React from 'react';
import PropTypes from 'prop-types';
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
    width: 100%;
    height: 100%;
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
  lang,
  name,
  value,
  children,
  checked,
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
        <label htmlFor={id} onClick={onClick} lang={lang}>
          {children}
        </label>
      </Radio>
    </ThemeProvider>
  );
};

RadioBtn.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  lang: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.string,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default React.memo(RadioBtn);
