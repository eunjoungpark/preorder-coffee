import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as productsImage from '../../images/products';
import { Contents, PageTitle } from '../../components/common';
import { initProduct, onSetProduct } from '../../store/product';
import { initOptions } from '../../store/options';
import { commas } from '../../libs/util';

const ListItem = styled.li`
  display: inline-block;
  width: 50%;
  vertical-align: top;
  animation-name: listLoading;
  animation-duration: 0.8s;
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

  @keyframes listLoading {
    to {
      opacity: 1;
      margin-top: 0;
    }
    from {
      opacity: 0;
      margin-top: 100px;
    }
  }

  @media screen and (max-width: 430px) {
    img {
      width: 100%;
    }
  }
`;

const List = ({ lists, initProduct, initOptions, onSetProduct }) => {
  const { hot, iced } = lists;
  useEffect(() => {
    initProduct();
    initOptions();
  }, []);

  const onSetProductHandler = useCallback((type, kind) => {
    onSetProduct({ type, kind });
  }, []);

  return (
    lists && (
      <Contents>
        <PageTitle>메뉴</PageTitle>
        <ul className="clear">
          {Object.keys(hot).map((kind, index) => {
            const hotItem = hot[kind];
            const url = `/view?type=hot&kind=${kind}`;
            return (
              <ListItem key={`hot${index}`}>
                <Link to={url} onClick={() => onSetProductHandler('hot', kind)}>
                  <img
                    src={productsImage[`hot_${kind}`]}
                    width="180"
                    alt={hotItem.ko}
                  />
                  <p className="en">{hotItem.en}</p>
                  <p className="ko">{hotItem.ko}</p>
                  <p className="price">{commas(hotItem.price)}</p>
                </Link>
              </ListItem>
            );
          })}
          {Object.keys(iced).map((kind, index) => {
            const icedItem = iced[kind];
            const url = `/view?type=iced&kind=${kind}`;
            return (
              <ListItem key={`iced${index}`}>
                <Link
                  to={url}
                  onClick={() => onSetProductHandler('iced', kind)}
                >
                  <img src={productsImage[`iced_${kind}`]} alt={icedItem.ko} />
                  <p className="en">{icedItem.en}</p>
                  <p className="ko">{icedItem.ko}</p>
                  <p className="price">{commas(icedItem.price)}</p>
                </Link>
              </ListItem>
            );
          })}
        </ul>
      </Contents>
    )
  );
};

List.propTypes = {
  lists: PropTypes.object.isRequired,
  initProduct: PropTypes.func.isRequired,
  initOptions: PropTypes.func.isRequired,
  onSetProduct: PropTypes.func.isRequired,
};

const mapDispatchToProps = { initProduct, initOptions, onSetProduct };

export default connect(
  null,
  mapDispatchToProps,
)(List);
