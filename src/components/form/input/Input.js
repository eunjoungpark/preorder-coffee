import React from 'react';
import styled from 'styled-components';

const InputBox = styled.fieldset`
  input {
    border-radius: 3px;
    border: 1px solid #999;
    box-sizing: border-box;
  }
  &.success {
    background-color: #2dc97a;
  }
  &.error {
    background-color: #dd6868;
  }
`;

const Input = ({
  type,
  id,
  value,
  label,
  placeholder,
  changed,
  className,
  hidden,
}) => {
  return (
    <InputBox className="clear">
      <label htmlFor={id} className={hidden ? 'hidden' : null}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={changed}
        value={value}
        className={className}
      />
    </InputBox>
  );
};

export default React.memo(Input);
