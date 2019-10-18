import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Contents, PageTitle } from '../../components/common';
import { initProduct, onSetProduct } from '../../store/product';
import { initOptions } from '../../store/options';
import { commas } from '../../libs/util';

const ListItem = styled.li`
  display: inline-block;
  width: 50%;
  vertical-align: top;
  animation-name: listLoading;
  animation-duration: 0.5s;
  a {
    position: relative;
    display: block;
    padding: 20px 10px;
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
    height: 126px;
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
      margin-top: 50px;
    }
  }

  @media screen and (max-width: 430px) {
    img {
      width: 100%;
      height: auto;
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
                  <figure>
                    <img
                      src={`/images/coffee/hot/${kind}.jpg`}
                      width="180"
                      alt=""
                    />
                    <figcaption>
                      <p className="en" lang="en">
                        {hotItem.en}
                      </p>
                      <p className="ko">{hotItem.ko}</p>
                    </figcaption>
                    <p className="price">{commas(hotItem.price)}</p>
                  </figure>
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
                  <figure>
                    <img src={`/images/coffee/iced/${kind}.jpg`} alt="" />
                    <figcaption>
                      <p className="en">{icedItem.en}</p>
                      <p className="ko">{icedItem.ko}</p>
                    </figcaption>
                    <p className="price">{commas(icedItem.price)}</p>
                  </figure>
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
