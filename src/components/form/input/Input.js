import React from 'react';
import PropTypes from 'prop-types';
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
  name,
  value,
  label,
  placeholder,
  changed,
  className,
  hidden,
  errormessage,
}) => {
  return (
    <InputBox className="clear">
      <label htmlFor={id} className={hidden ? 'hidden' : null}>
        {label}
      </label>
      <input
        type={type ? type : 'text'}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={changed}
        value={value}
        className={className}
        aria-errormessage={errormessage ? errormessage : null}
      />
    </InputBox>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  changed: PropTypes.func,
  className: PropTypes.string,
  hidden: PropTypes.bool,
};

export default React.memo(Input);
