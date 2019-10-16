import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { commas } from '../../libs/util';
import Button from '../../components/form/button/Button';
import Modal from '../../components/modal/Modal';
import Loading from '../../components/loading/Loading';
import { Contents, PageTitle, FlextCont } from '../../components/common';
import ItemCount from '../../components/form/itemGroup/ItemCount';
import { types, cups } from '../../store/options';
import { setMenuCount } from '../../store/mymenu';
import { addOrderList, ADD_ORDER_LIST } from '../../store/order';
import { emptyLoading } from '../../store/loadings';

const ItemBase = styled.div`
  margin: 0 5px;
  .itemImg {
    float: left;
    width: 170px;
    text-align: center;
    img {
      width: 150px;
    }
  }
  .itemInfo {
    margin-bottom: 20px;
    overflow: hidden;
  }
  p.ko {
    font-size: 18px;
    color: #333;
    line-height: 1.5;
  }
  p.price {
    font-size: 22px;
    color: #8c6046;
  }
`;

const OptionBox = styled.div`
  background-color: #f2efeb;
  padding: 5px;
  border-radius: 5px;

  ul {
    background-color: #fff;
    padding: 15px;
    border-radius: 5px;
    li {
      line-height: 1.5;
      font-size: 14px;
    }
  }
`;

const PayBox = styled.div`
  padding:25px 0;
  margin-top:25px;
  border-top:1px dashed #cdcdcd;
    .store {
      text-align: center;
      line-height:1.5;
      a {
        display: inline-block;
          padding: 5px;
          margin: -4px 0 0 5px;
          font-size: 14px;
          vertical-align: middle;
          border-radius: 3px;
          background-color: #d9b391;
          line-height:1;
      }
    }
  }
`;

//음료주문 최대값
const MAX = 20;
const MyMenuPay = ({
  auth,
  menu,
  selected,
  setMenuCount,
  addOrderList,
  loadingAddOrder,
  emptyLoading,
  history,
}) => {
  const [modalMsg, setModalMsg] = useState('');
  const [alertModal, setAlertModal] = useState(true);
  if (!menu) {
    history.go(-1);
  }

  useEffect(() => {
    return () => emptyLoading();
  }, []);

  //합계 계산
  const total = useMemo(() => {
    if (menu) {
      return menu.total * menu.count;
    }
  }, [menu]);

  //음료수 감소
  const onHandlerDecreaseCount = useCallback(
    cnt => {
      if (cnt - 1 < 1) {
        setAlertModal(false);
        setModalMsg('최소 수량은 1잔 이상입니다.');
        return;
      }
      setMenuCount(cnt - 1);
    },
    [alertModal],
  );

  // 음료수 증가
  const onHandlerIncreaseCount = useCallback(
    cnt => {
      if (cnt + 1 > MAX) {
        setAlertModal(false);
        setModalMsg('최대 주문가능 수량은 20잔 입니다.');
        return;
      }
      setMenuCount(cnt + 1);
    },
    [alertModal],
  );

  //주문 추가
  const onAddOrderHandler = useCallback(() => {
    if (!selected) {
      setAlertModal(false);
      setModalMsg('주문하실 매장을 선택해주세요.');
    } else {
      if (menu) {
        addOrderList({
          token: auth.idToken,
          userId: auth.localId,
          order: {
            userId: auth.localId,
            contents:
              (menu.nickname !== '' ? menu.nickname : menu.ko) +
              (menu.count > 1 ? ` 외 ${menu.count - 1}잔` : ' 1잔'),
            total: total,
            store: selected,
            date: new Date().getTime(),
          },
        });
      }
    }
  }, [menu, selected]);

  //주문완료시, 목록이동
  const onClickCompleteHandler = useCallback(() => {
    history.push('/');
  }, []);

  //모달가림
  const onClickAlertHandler = useCallback(() => {
    setModalMsg('');
    setAlertModal(!alertModal);
  }, [alertModal]);

  return (
    menu && (
      <Contents>
        <PageTitle>나만의 음료 주문</PageTitle>
        {loadingAddOrder && <Loading />}
        {loadingAddOrder === false && (
          <Modal onClickHandler={onClickCompleteHandler}>
            주문이 완료되었습니다.
            <br />
            <Button kind="default" onClick={onClickCompleteHandler}>
              확인
            </Button>
          </Modal>
        )}

        <Modal shown={alertModal} onClickHandler={onClickAlertHandler}>
          {modalMsg}
          <br />
          <Button kind="default" onClick={onClickAlertHandler}>
            확인
          </Button>
        </Modal>

        <form>
          <ItemBase className="clear">
            <div className="itemImg">
              <img
                src={menu.image}
                width="150"
                alt={menu.nickname !== '' ? menu.nickname : menu.ko}
              />
            </div>
            <div className="itemInfo">
              <p className="ko">
                {menu.nickname !== '' ? menu.nickname : menu.ko}
              </p>
              <p className="price">{commas(total)}</p>
            </div>
            <ItemCount
              count={menu.count}
              ariaLabel="음료 수량"
              onDecrease={() => onHandlerDecreaseCount(menu.count)}
              onIncrease={() => onHandlerIncreaseCount(menu.count)}
            >
              주문수량
            </ItemCount>
          </ItemBase>
          <OptionBox>
            <ul>
              <li>
                {types[menu.type]}/{menu.size}/{cups[menu.cup]}
              </li>
              <li>
                {Object.keys(menu.messages).map(option => {
                  return menu.messages[option] !== '' &&
                    'cup size'.indexOf(option) < 0
                    ? menu.messages[option] + '/'
                    : null;
                })}
              </li>
            </ul>
          </OptionBox>
          <PayBox>
            <p className="store">
              {selected ? (
                <>
                  <strong>[{selected.name}]</strong> {selected.address}
                </>
              ) : (
                '주문할 매장을 선택해 주세요.'
              )}
              <Link to="/store">설정</Link>
            </p>
            <FlextCont>
              <Button kind="base" onClick={onAddOrderHandler}>
                주문하기
              </Button>
            </FlextCont>
          </PayBox>
        </form>
      </Contents>
    )
  );
};

MyMenuPay.propTypes = {
  auth: PropTypes.object,
  menu: PropTypes.object,
  selected: PropTypes.object,
  setMenuCount: PropTypes.func,
  addOrderList: PropTypes.func,
  emptyLoading: PropTypes.func,
  loadingAddOrder: PropTypes.bool,
};

const mapStateToProps = ({ auth, mymenu, store, loadings }) => ({
  auth,
  menu: mymenu.menu,
  selected: store.selected,
  loadingAddOrder: loadings[ADD_ORDER_LIST],
});

const mapDispatchToProps = { setMenuCount, addOrderList, emptyLoading };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyMenuPay);
