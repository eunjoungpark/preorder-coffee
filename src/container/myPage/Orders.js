import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Contents, PageTitle } from '../../components/common';
import Loading from '../../components/loading/Loading';
import { initOrderList, ORDER_LIST } from '../../store/order';
import { commas } from '../../libs/util';

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
          text-align: left;
        }
        .total {
          text-align: left;
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
const Orders = ({ auth, order, history, initOrderList, loadingOrder }) => {
  useEffect(() => {
    if (auth.localId) {
      initOrderList({
        token: auth.idToken,
        userId: auth.localId,
      });
    } else {
      history.push('/');
    }
  }, [auth.localId]);

  return (
    <Contents>
      <PageTitle>주문 내역</PageTitle>
      {loadingOrder && <Loading />}
      {Object.keys(order).length > 0 ? (
        <OrderWrap>
          <table>
            <colgroup>
              <col width="10%" />
              <col width="50%" />
              <col width="20%" />
              <col width="20%" />
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
              {Object.keys(order).map((o, index) => {
                const date = new Date(order[o].date);
                return (
                  <tr key={index}>
                    <td className="num">{index + 1}</td>
                    <td>
                      <p className="info">{order[o].contents}</p>
                      <p className="total">
                        <strong>결제금액 : </strong> {commas(order[o].total)}원
                      </p>
                    </td>
                    <td>{order[o].store.name}</td>
                    <td className="date">{`${date.getFullYear()}.${date.getMonth() +
                      1}.${date.getDate()}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </OrderWrap>
      ) : (
        <EmptyBox>주문내역이 없습니다.</EmptyBox>
      )}
    </Contents>
  );
};

const mapStateToProps = ({ auth, order, loadings }) => ({
  auth,
  order,
  loadingOrder: loadings[ORDER_LIST],
});

const mapDispatchToProps = { initOrderList };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Orders);