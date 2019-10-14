import React from 'react';
import styled from 'styled-components';
const CheckBox = styled.fieldset`
  position: relative;
  input {
    position: absolute;
    z-index: -1;
  }
  label {
    padding-left: 25px;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 14px;
      height: 14px;
      z-index: 1;
      border: 2px solid #d9b391;
    }
    &.checked:after {
      position: absolute;
      top: 3px;
      left: 3px;
      content: '';
      width: 9px;
      height: 6px;
      transform: rotate(-47deg);
      border-left: 3px solid #8c6046;
      border-bottom: 3px solid #8c6046;
      z-index: 2;
    }
  }
`;
const Checkbox = ({ id, label, checked, legend, className, onClick }) => {
  return (
    <CheckBox className={className}>
      <legend className="hidden">{legend}</legend>
      <input
        type="checkbox"
        id={id}
        name={id}
        defaultChecked={checked}
        onClick={onClick}
      />
      <label htmlFor={id} className={checked ? 'checked' : ''}>
        {label}
      </label>
    </CheckBox>
  );
};
export default React.memo(Checkbox);
