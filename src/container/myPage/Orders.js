import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { commas } from '../../libs/util';
import { Contents, PageTitle } from '../../components/common';
import Loading from '../../components/loading/Loading';
import {
  initOrderList,
  emptyOrderList,
  ORDER_LIST,
  ADD_ORDER_LIST,
} from '../../store/order';
import { emptyLoading } from '../../store/loadings';

const OrderWrap = styled.div`
  table {
    width: 100%;
    border: 1px solid #cdcdcd;
    thead {
      th {
        height: 30px;
        background-color: #333;
        color: #fff;
        font-size: 14px;
      }
    }
    tbody {
      & > tr:nth-child(even) {
        background-color: #ededed;
      }
      td {
        height: 60px;
        line-height: 1.3;
        font-size: 14px;
        text-align: center;
        .info {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;

const EmptyBox = styled.div`
  padding: 40px;
  color: #666;
  text-align: center;
  font-size: 16px;
`;
const LIMIT = 8;
const Orders = ({
  auth,
  orderList,
  page,
  finish,
  initOrderList,
  emptyOrderList,
  loadingOrder,
  loadingAddOrder,
  history,
}) => {
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    if (auth.localId) {
      initOrderList({
        token: auth.idToken,
        userId: auth.localId,
        page,
        limit: 7,
      });
    } else {
      history.push('/');
    }
  }, []);

  const onScroll = useCallback(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body || document.documentElement;
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 10) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, false);
    return () => {
      emptyLoading(ORDER_LIST);
      emptyOrderList();
      window.removeEventListener('scroll', onScroll, false);
    };
  }, []);

  useEffect(() => {
    if (page && !finish) {
      initOrderList({
        token: auth.idToken,
        userId: auth.localId,
        page,
        limit: LIMIT,
      });
    }
  }, [isScroll]);

  return (
    <Contents>
      <PageTitle>주문 내역</PageTitle>
      {loadingOrder && <Loading />}
      <OrderWrap>
        <table>
          <colgroup>
            <col width="10%" />
            <col width="35%" />
            <col width="30%" />
            <col width="25%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">NO.</th>
              <th scope="col">주문 내용</th>
              <th scope="col">지점</th>
              <th scope="col">날짜</th>
            </tr>
          </thead>
          <tbody>
            {orderList.length <= 0 ? (
              <tr>
                <td colSpan="4">
                  <EmptyBox>주문내역이 없습니다.</EmptyBox>
                </td>
              </tr>
            ) : (
              orderList.map((o, index) => {
                const date = new Date(o.date);
                return (
                  <tr key={index}>
                    <td className="num">{index + 1}</td>
                    <td>
                      <p className="info">{o.contents}</p>
                      <p className="total">
                        <strong>결제금액 : </strong> {commas(o.total)}원
                      </p>
                    </td>
                    <td>{o.store.name}</td>
                    <td className="date">
                      {`${date.getFullYear()}.${date.getMonth() +
                        1}.${date.getDate()}`}{' '}
                      <br />
                      {`${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()}`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </OrderWrap>
    </Contents>
  );
};

Orders.propTypes = {
  order: PropTypes.object,
  auth: PropTypes.object.isRequired,
  initOrderList: PropTypes.func.isRequired,
  loadingOrder: PropTypes.bool,
};

const mapStateToProps = ({ auth, order, loadings }) => ({
  auth,
  orderList: order.lists,
  page: order.endAt,
  finish: order.finish,
  loadingOrder: loadings[ORDER_LIST],
  loadingAddOrder: loadings[ADD_ORDER_LIST],
});

const mapDispatchToProps = { initOrderList, emptyOrderList };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orders);
