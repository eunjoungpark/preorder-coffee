import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as productsImage from '../../images/products';
const ListItem = styled.li`
  display: inline-block;
  width: 50%;
  margin: 20px 0;
  vertical-align: top;
  a {
    position: relative;
    display: block;
    padding: 20px 10px;
    text-indent: 10px;
    &:hover {
      :after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: black;
        opacity: 0.3;
      }
    }
  }

  img {
    width: 180px;
    margin: 0 auto 10px auto;
    display: block;
  }
  p.en {
    margin-bottom: 10px;
    font-size: 18px;
    color: #3e4759;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p.ko {
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p.price {
    font-size: 22px;
    color: #8c6046;
  }

  @media screen and (max-width: 430px) {
    img {
      width: 100%;
    }
  }
`;

const Product = ({ lists }) => {
  const { hot, iced } = lists;
  return (
    <ul className="clear">
      {Object.keys(hot).map((kind, index) => {
        const hotItem = hot[kind];
        const url = `/view?type=hot&kind=${kind}`;
        return (
          <ListItem key={`hot${index}`}>
            <Link to={url}>
              <img
                src={productsImage[`hot_${kind}`]}
                width="180"
                alt={hotItem.ko}
              />
              <p className="en">{hotItem.en}</p>
              <p className="ko">{hotItem.ko}</p>
              <p className="price">{hotItem.price}</p>
            </Link>
          </ListItem>
        );
      })}
      {Object.keys(iced).map((kind, index) => {
        const icedItem = iced[kind];
        const url = `/view?type=iced&kind=${kind}`;
        return (
          <ListItem key={`iced${index}`}>
            <Link to={url}>
              <img src={productsImage[`iced_${kind}`]} alt={icedItem.ko} />
              <p className="en">{icedItem.en}</p>
              <p className="ko">{icedItem.ko}</p>
              <p className="price">{icedItem.price}</p>
            </Link>
          </ListItem>
        );
      })}
    </ul>
  );
};

export default React.memo(Product);
