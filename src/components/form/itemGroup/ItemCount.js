import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../button/Button';

const ItemCountStyle = styled.fieldset`
  margin: 15px 5px;
  .label {
    float: left;
    vertical-align: middle;
    line-height: 30px;
  }
  .count {
    float: right;
  }
  .quantity {
    display: inline-block;
    padding: 0 10px;
  }
`;

const ItemCount = ({
  children,
  hidden,
  count,
  onDecrease,
  onIncrease,
  ariaLabel,
  name,
}) => {
  return (
    <ItemCountStyle>
      <legend className={hidden ? 'hidden' : 'label'}>{children}</legend>
      <input type="hidden" name={name} value={count} />
      <div className="count">
        <Button kind="default" onClick={onDecrease} ariaLabel="1만큼 수량감소">
          <span aria-hidden="true">-</span>
        </Button>
        <span className="quantity" aria-label={ariaLabel ? ariaLabel : null}>
          {count}
        </span>
        <Button kind="default" onClick={onIncrease} ariaLabel="1만큼 수량증가">
          <span aria-hidden="true">+</span>
        </Button>
      </div>
    </ItemCountStyle>
  );
};

ItemCount.propTypes = {
  children: PropTypes.string,
  hidden: PropTypes.string,
  count: PropTypes.number,
  name: PropTypes.string,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
};
export default React.memo(ItemCount);
