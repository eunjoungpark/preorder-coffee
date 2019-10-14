import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/form/button/Button';
import { Contents, PageTitle, FlextCont } from '../../components/common';
import ItemCount from '../../components/form/itemGroup/ItemCount';
import * as productsImage from '../../images/products';
import { types, cups } from '../../store/options';
import { setMenuCount } from '../../store/mymenu';
import { addOrderList } from '../../store/order';
import { commas } from '../../libs/util';

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
      a {
        display: inline-block;
          padding: 5px;
          margin: -4px 0 0 5px;
          font-size: 14px;
          vertical-align: middle;
          border-radius: 3px;
          background-color: #d9b391;
      }
    }
  }
`;

//음료주문 최대값
const MAX = 20;
const MyMenuPay = ({
  auth,
  menu,
  history,
  selected,
  setMenuCount,
  addOrderList,
}) => {
  if (!menu) {
    history.go(-1);
  }

  //합계 계산
  const total = useMemo(() => {
    if (menu) {
      return menu.total * menu.count;
    }
  }, [menu]);

  //음료수 감소
  const onHandlerDecreaseCount = useCallback(cnt => {
    if (cnt - 1 < 1) {
      alert('최소 수량은 1잔 이상입니다.');
      return;
    }
    setMenuCount(cnt - 1);
  }, []);

  // 음료수 증가
  const onHandlerIncreaseCount = useCallback(cnt => {
    if (cnt + 1 > MAX) {
      alert('최대 주문가능 수량은 9잔 입니다.');
      return;
    }
    setMenuCount(cnt + 1);
  }, []);

  //주문 추가
  const onAddOrderHandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else if (!selected) {
      alert('주문하실 매장을 선택해주세요.');
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
            date: new Date(),
          },
        });
      }
    }
  }, [menu, selected]);

  return (
    menu && (
      <Contents>
        <PageTitle>나만의 음료 주문</PageTitle>
        <form>
          <ItemBase className="clear">
            <div className="itemImg">
              <img
                src={productsImage[menu.image]}
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

const mapStateToProps = ({ auth, mymenu, store }) => ({
  auth,
  menu: mymenu.menu,
  selected: store.selected,
});

const mapDispatchToProps = { setMenuCount, addOrderList };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyMenuPay);
