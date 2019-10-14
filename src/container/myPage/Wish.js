import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import produce from 'immer';
import styled from 'styled-components';
import { Contents, PageTitle, FlextCont } from '../../components/common';
import Checkbox from '../../components/form/checkbox/Checkbox';
import Loading from '../../components/loading/Loading';
import Button from '../../components/form/button/Button';
import Modal from '../../components/modal/Modal';
import { MdClose } from 'react-icons/md';
import { commas } from '../../libs/util';
import { types, cups } from '../../store/options';
import {
  updateWishList,
  checkedWish,
  removeWish,
  WISH_LIST,
  REMOVE_WISH,
} from '../../store/wish';
import { addOrderList } from '../../store/order';
import { emptyLoading } from '../../store/loadings';

const WishWrap = styled.div`
  padding-bottom: 220px;
  .allChk {
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid #260f07;
  }
  .payBox {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 20px;
    background-color: #260f07;
    z-index: 5;
    .inn {
      padding: 20px 10px;
      background-color: #fff;
      border-radius: 5px;
      .sumBox {
        margin-bottom: 20px;
        padding: 0 10px 10px;
        border-bottom: 1px solid #260f07;
        font-size: 18px;
        .sum {
          color: #8c6046;
          float: right;
        }
      }
      .store {
        text-align: center;
        a {
          display: inline-block;
          padding: 5px;
          margin: -5px 0 0 10px;
          font-size: 14px;
          vertical-align: middle;
          border-radius: 3px;
          background-color: #d9b391;
        }
      }
    }
  }
  .list {
    > li {
      position: relative;
      padding: 15px;
      &:nth-child(even) {
        background-color: #ededed;
      }
      fieldset {
        margin-bottom: 10px;
      }
      .options {
        padding-left: 25px;
        li {
          margin: 10px 0;
          font-size: 14px;
          color: #8c6046;
          .option {
            float: left;
          }
          .extra {
            float: right;
          }
        }
      }
      .total {
        margin-top: 20px;
        text-align: right;
        color: #260f07;
      }
      .removeBtn {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #260f07;
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

const Wish = ({
  wish,
  auth,
  selected,
  history,
  loadingWish,
  addOrderList,
  updateWishList,
  checkedWish,
  removeWish,
  loadingAddWish,
  emptyLoading,
}) => {
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [allCheck, setAllCheck] = useState(true);

  useEffect(() => {
    if (auth.localId === null) {
      history.push('/');
    }
  }, [auth.localId]);

  useEffect(() => {
    let s = 0, //음료합계
      c = 0; //음료수
    if (wish) {
      Object.keys(wish).forEach(w => {
        if (wish[w].checked === true) {
          s += wish[w].total;
          c += 1;
        }
      });

      //일일항목 전체선택 여부
      setAllCheck(Object.keys(wish).every(e => wish[e].checked === true));
    }
    setTotal(s);
    setCount(c);
  }, [wish]);

  useEffect(() => {
    return () => emptyLoading();
  }, []);

  //전체 선택 토글
  const onClickCheckHandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else {
      updateWishList({
        token: auth.idToken,
        userId: auth.localId,
        wish: produce(wish, draft => {
          Object.keys(draft).forEach(w => {
            draft[w].checked = !allCheck;
          });
        }),
      });
      setAllCheck(!allCheck);
    }
  }, [wish, allCheck]);

  //결제할 항목 토글
  const onCheckHandler = useCallback((id, checked) => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else {
      checkedWish({
        token: auth.idToken,
        userId: auth.localId,
        id,
        wish: produce(wish[id], draft => {
          draft.checked = !checked;
        }),
      });
    }
  }, []);

  //항목삭제
  const onRemoveHandler = useCallback(id => {
    removeWish({
      token: auth.idToken,
      userId: auth.localId,
      id,
    });
  }, []);

  //주문 추가
  const onAddOrderHandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else if (!selected) {
      alert('주문하실 매장을 선택해주세요.');
    } else {
      if (wish) {
        const firstMenu = wish[Object.keys(wish)[0]];
        addOrderList({
          token: auth.idToken,
          userId: auth.localId,
          order: {
            userId: auth.localId,
            contents:
              (firstMenu.nickname !== '' ? firstMenu.nickname : firstMenu.ko) +
              (count > 1 ? ` 외 ${count - 1}잔` : ' 1잔'),
            total: total,
            store: selected,
            date: new Date(),
          },
        });
      }
    }
  }, [wish, selected, total, count]);

  return (
    <Contents>
      <PageTitle>위시 리스트</PageTitle>
      <WishWrap>
        <form>
          <Checkbox
            id="allCheck"
            label="전체음료"
            legend="위시리스트에 모든음료 주문선택"
            onClick={onClickCheckHandler}
            checked={allCheck}
            className="allChk"
          />
          {(loadingWish || loadingAddWish) && <Loading />}
          {loadingAddWish === false && <Modal>삭제되었습니다.</Modal>}
          {Object.keys(wish).length > 0 ? (
            <>
              <ol className="list">
                {Object.keys(wish).map(w => {
                  return (
                    <li key={w}>
                      <Checkbox
                        id={w}
                        label={
                          wish[w].nickname !== ''
                            ? wish[w].nickname
                            : wish[w].ko
                        }
                        legend={`${wish[w].ko} 선택하기`}
                        checked={wish[w].checked}
                        style={{ background: wish[w].checked ? 'red' : '' }}
                        onClick={() => onCheckHandler(w, wish[w].checked)}
                      />
                      <ul className="options">
                        <li className="clear">
                          <span className="option">
                            {types[wish[w].type]}/{wish[w].size}/
                            {cups[wish[w].cup]}
                          </span>
                          <span className="extra">
                            {commas(wish[w].price)}원
                          </span>
                        </li>
                        {wish[w].shot.count > 0 && (
                          <li className="clear">
                            <span className="option">에스프레소</span>
                            <span className="extra">
                              {commas(wish[w].shot.count * wish[w].shot.extra)}
                              원
                            </span>
                          </li>
                        )}
                        {wish[w].syrup.mocha.count > 0 && (
                          <li className="clear">
                            <span className="option">모카 시럽</span>
                            <span className="extra">
                              {commas(
                                wish[w].syrup.mocha.count *
                                  wish[w].syrup.mocha.extra,
                              )}
                              원
                            </span>
                          </li>
                        )}
                        {wish[w].syrup.hazelnut.count > 0 && (
                          <li className="clear">
                            <span className="option">헤이즐넛 시럽</span>
                            <span className="extra">
                              {commas(
                                wish[w].syrup.hazelnut.count *
                                  wish[w].syrup.hazelnut.extra,
                              )}
                              원
                            </span>
                          </li>
                        )}
                        {wish[w].syrup.caramel.count > 0 && (
                          <li className="clear">
                            <span className="option">카라멜 시럽</span>
                            <span className="extra">
                              {commas(
                                wish[w].syrup.caramel.count *
                                  wish[w].syrup.caramel.extra,
                              )}
                              원
                            </span>
                          </li>
                        )}
                        {wish[w].syrup.vanilla.count > 0 && (
                          <li className="clear">
                            <span className="option">바닐라 시럽</span>
                            <span className="extra">
                              {commas(
                                wish[w].syrup.vanilla.count *
                                  wish[w].syrup.vanilla.extra,
                              )}
                              원
                            </span>
                          </li>
                        )}
                        {Object.keys(wish[w].messages).map(
                          i =>
                            wish[w].messages[i] !== '' &&
                            'cup shot size mocha hazelnut caramel vanilla'.indexOf(
                              i,
                            ) < 0 && (
                              <li key={i} className="clear">
                                <span className="option">
                                  {wish[w].messages[i]}
                                </span>
                                <span className="extra">0원</span>
                              </li>
                            ),
                        )}
                      </ul>
                      <p className="total">{commas(wish[w].total)}원</p>
                      <Button
                        kind="blank"
                        className="removeBtn"
                        onClick={() => onRemoveHandler(w)}
                      >
                        <MdClose />
                      </Button>
                    </li>
                  );
                })}
              </ol>
              <div className="payBox">
                <div className="inn">
                  <p className="sumBox">
                    총 {count}개<span className="sum">{commas(total)}원</span>
                  </p>
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
                </div>
              </div>
            </>
          ) : (
            <EmptyBox>주문하실 음료가 없습니다.</EmptyBox>
          )}
        </form>
      </WishWrap>
    </Contents>
  );
};

const mapStateToProps = ({ wish, auth, store, loadings }) => ({
  wish,
  auth,
  loadingWish: loadings[WISH_LIST],
  loadingAddWish: loadings[REMOVE_WISH],
  selected: store.selected,
});

const mapDispatchToProps = {
  updateWishList,
  checkedWish,
  removeWish,
  addOrderList,
  emptyLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wish);
