import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Contents, PageTitle } from '../../components/common';
import { MdHome } from 'react-icons/md';
import Button from '../../components/form/button/Button';
import Input from '../../components/form/input/Input';
import Loading from '../../components/loading/Loading';
import { initStore, setStore, GET_STORES } from '../../store/store';
import { emptyLoading } from '../../store/loadings';

const StoreWrap = styled.div`
  fieldset {
    margin-bottom: 20px;

    input {
      width: 100%;
      padding: 10px;
      line-height: 1;
    }
  }
  .list {
    li {
      padding: 10px;
      &:nth-child(odd) {
        background-color: #ededed;
      }
    }

    button {
      display: block;
      width: 100%;
      text-align: left;
      .storeIcon {
        float: left;
        width: 60px;
        height: 60px;
        padding: 15px;
        color: #fff;
        background-color: #999;
        font-size: 30px;
      }
      .storeInfo {
        display: block;
        overflow: hidden;
        padding: 0 0 0 10px;
        line-height: 1.5;
        strong {
          font-size: 16px;
        }
        address {
          font-style: normal;
          font-size: 14px;
          line-height: 1.3;
        }
      }
    }
  }
`;

const Store = ({ history, store, initStore, setStore, loadingStore }) => {
  const [result, setResult] = useState([]);
  //지점 Data가져오기
  useEffect(() => {
    initStore();
  }, [initStore]);

  //지점정보를 초기에 Array타입으로 세팅
  useEffect(() => {
    if (store.stores) {
      setResult(Object.keys(store.stores).map(s => store.stores[s]));
    }
  }, [store.stores]);

  useEffect(() => {
    return () => emptyLoading(GET_STORES);
  }, []);

  //검색필드에 따른 지점정보 재설정
  const onChangeStoreHandler = useCallback(
    e => {
      const { value } = e.target;
      setResult(
        Object.keys(store.stores)
          .map(s => store.stores[s])
          .filter(r => {
            return r.address.indexOf(value.trim()) > -1 ||
              r.name.indexOf(value.trim()) > -1
              ? r
              : null;
          }),
      );
    },
    [result],
  );

  const onClickStoreHandler = useCallback(
    index => {
      history.go(-1);
      setStore(result[index]);
    },
    [result],
  );

  return (
    <Contents>
      <PageTitle>매장검색</PageTitle>
      <StoreWrap>
        <Input
          type="text"
          id="findStore"
          label="매장검색"
          hidden
          changed={onChangeStoreHandler}
          placeholder="검색 해보세요"
        />
        {loadingStore && <Loading />}
        <ul className="list">
          {result.map((s, index) => {
            return (
              <li key={index}>
                <Button
                  kind="blank"
                  className="clear"
                  onClick={() => onClickStoreHandler(index)}
                >
                  <span className="storeIcon">
                    <MdHome />
                  </span>
                  <span className="storeInfo">
                    <strong>{s.name}</strong>
                    <address>{s.address}</address>
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </StoreWrap>
    </Contents>
  );
};

Store.propTypes = {
  store: PropTypes.object.isRequired,
  initStore: PropTypes.func.isRequired,
  setStore: PropTypes.func.isRequired,
  loadingStore: PropTypes.bool,
};

const mapStateToProps = ({ store, loadings }) => ({
  store: store,
  loadingStore: loadings[GET_STORES],
});

const mapDispatchToprops = { initStore, setStore };

export default connect(
  mapStateToProps,
  mapDispatchToprops,
)(Store);
