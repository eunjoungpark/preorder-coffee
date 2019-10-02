import React from 'react';
import styled from 'styled-components';

/* Form */
export const ItemGroupStyle = styled.fieldset`
  legend {
    padding: 10px 5px;
  }
  .count {
    width: 100%;
    margin: 5px 0;
    display: flex;
    > span {
      display: block;
      flex: 1;
    }
  }
`;

const ItemGroup = ({ children, hidden, label }) => {
  return (
    <ItemGroupStyle>
      <legend className={hidden ? 'hidden' : null}>{label}</legend>
      <div className="count">{children}</div>
    </ItemGroupStyle>
  );
};

export default React.memo(ItemGroup);
