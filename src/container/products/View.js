import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from '../../libs/qs';
import produce from 'immer';
import { MdSend } from 'react-icons/md';
import styled from 'styled-components';
import Button from '../../components/form/button/Button';
import RadioBtn from '../../components/form/radio/RadioBtn';
import {
  Contents,
  PageTitle,
  SubTitle,
  FlextCont,
} from '../../components/common';
import ItemCount from '../../components/form/itemGroup/ItemCount';
import ItemGroup from '../../components/form/itemGroup/ItemGroup';
import * as productsImage from '../../images/products';
import { onSetProduct } from '../../store/product';
import {
  onSetCount,
  onSetSyrup,
  onSetCup,
  onSetSize,
  onSetTotal,
  onSetMessages,
  onSetShot,
  onSetPrice,
  cups,
} from '../../store/options';

const ItemBase = styled.div`
  margin: 0 5px;
  .itemImg {
    float: left;
    width: 50%;
    text-align: center;
    img {
      width: 150px;
    }
  }
  .itemInfo {
    float: right;
    width: 50%;
    margin-bottom: 20px;
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

const OptionGroup = styled.section`
  button {
    margin: 30px 5px 0;
    padding: 10px;
  }
  .noneMsg {
    color: #36a2cf;
    text-align: center;
  }
`;

const OptionBox = styled.div`
  li {
    color: #8c6046;
    padding: 5px;
    font-size: 16px;
  }
`;

//음료주문 최대값
const MAX = 20;
const View = ({
  history,
  location,
  lists,
  product,
  options,
  onSetProduct,
  onSetSyrup,
  onSetCount,
  onSetCup,
  onSetSize,
  onSetTotal,
  onSetShot,
  onSetPrice,
  onSetMessages,
}) => {
  const { type, kind } = qs(location);
  const s = kind === 'espresso' ? 'Solo' : 'Tall';
  const [hasMsg, setHasMsg] = useState(false);

  //사이즈설정
  useEffect(() => {
    if (options && options.size === '') {
      onSetSize(s);
    }
  }, []);

  //제품 설정
  useEffect(() => {
    if (lists) {
      onSetProduct({ type, kind });
    }
  }, [lists]);

  useEffect(() => {
    if (product && options && options.size !== '') {
      const { price, sizes } = product;
      const { size } = options;

      //음료 단가
      onSetPrice(price + sizes[size].extra);

      //에스프레소 수
      onSetShot(
        produce(options.shot, draft => {
          draft.base = sizes[options.size].shot;
        }),
      );

      //음료 시럽
      if (sizes[size]['syrup']) {
        Object.keys(sizes[size].syrup).forEach(sp => {
          onSetSyrup(
            produce(options.syrup, draft => {
              draft[sp].base = sizes[size].syrup[sp];
            }),
          );
        });
      }

      //메세지 설정
      setHasMsg(
        Object.keys(options.messages).every(key => {
          return options.messages[key] === '';
        }),
      );
    }
  }, [product, options]);

  //합계 계산
  useEffect(() => {
    if (options) {
      const price = options.price;
      const shotTotal = options.shot.count * options.shot.extra;
      const mochaTotal = options.syrup.mocha.count * options.syrup.mocha.price;
      const caramelTotal =
        options.syrup.caramel.count * options.syrup.caramel.price;
      const hazelnutTotal =
        options.syrup.hazelnut.count * options.syrup.hazelnut.price;
      const vanillaTotal =
        options.syrup.vanilla.count * options.syrup.vanilla.price;
      const total =
        (price +
          shotTotal +
          mochaTotal +
          caramelTotal +
          hazelnutTotal +
          vanillaTotal) *
        options.count;

      onSetTotal(total);
    }
  }, [options]);

  //음료타입 변경
  const onSetHandlerType = useCallback(coffeeType => {
    history.push(`/view?type=${coffeeType}&kind=${kind}`);
  }, []);

  //음료수 감소
  const onHandlerDecreaseCount = useCallback(cnt => {
    if (cnt - 1 < 1) {
      alert('최소 수량은 1잔 이상입니다.');
      return;
    }
    onSetCount(cnt - 1);
  }, []);

  // 음료수 증가
  const onHandlerIncreaseCount = useCallback(cnt => {
    if (cnt + 1 > MAX) {
      alert('최대 주문가능 수량은 9잔 입니다.');
      return;
    }
    onSetCount(cnt + 1);
  }, []);

  //컵 선택
  const onSetHandlerCup = useCallback(cup => {
    onSetCup(cup);
    onSetMessages({ cup: cups[cup] });
  }, []);

  //사이즈 변경
  const onSetHandlerSize = useCallback(sizeSel => {
    if (sizeSel !== 'Tall' && sizeSel !== 'Solo') {
      onSetMessages({ size: `사이즈 : ${sizeSel}` });
    } else {
      onSetMessages({ size: null });
    }
    onSetSize(sizeSel);
  }, []);

  return (
    product &&
    options && (
      <Contents>
        <PageTitle ko="아메리카노">{product.en}</PageTitle>
        <form>
          <ItemBase className="clear">
            <div className="itemImg">
              <img
                src={productsImage[`${type}_${kind}`]}
                width="150"
                alt="에스프레소"
              />
            </div>
            <div className="itemInfo">
              <p className="ko">{product.ko}</p>
              <p className="price">{options.total}</p>
            </div>
            <ItemCount
              count={options.count}
              onDecrease={() => onHandlerDecreaseCount(options.count)}
              onIncrease={() => onHandlerIncreaseCount(options.count)}
            >
              주문수량
            </ItemCount>
          </ItemBase>

          <ItemGroup label="뜨거운 음료, 차가운 음료 선택" hidden>
            <RadioBtn
              type="hot"
              id="waterType1"
              name="waterType"
              checked={type === 'hot' ? true : null}
              onClick={() => onSetHandlerType('hot')}
            >
              HOT
            </RadioBtn>
            <RadioBtn
              type="cold"
              id="waterType2"
              name="waterType"
              checked={type !== 'hot' ? true : null}
              onClick={() => onSetHandlerType('iced')}
            >
              ICED
            </RadioBtn>
          </ItemGroup>

          <ItemGroup label="컵 종류" hidden>
            {Object.keys(cups).map((c, index) => (
              <RadioBtn
                type="default"
                id={`cupType${index}`}
                name="cupType"
                key={c}
                checked={c === options.cup ? true : null}
                onClick={() => onSetHandlerCup(c)}
              >
                {cups[c]}
              </RadioBtn>
            ))}
          </ItemGroup>
          <ItemGroup label="사이즈 선택" hidden>
            {Object.keys(product.sizes).map((s, index) => (
              <RadioBtn
                type="default"
                id={`sizeType${index}`}
                name="sizeType"
                key={s}
                checked={s === options.size ? true : null}
                onClick={() => onSetHandlerSize(s)}
              >
                {s}
              </RadioBtn>
            ))}
          </ItemGroup>
        </form>
        <OptionGroup>
          <SubTitle>추가옵션</SubTitle>
          {!hasMsg && (
            <OptionBox>
              <ul>
                {Object.keys(options.messages).map(option => {
                  return options.messages[option] !== '' ? (
                    <li key={option}>{options.messages[option]}</li>
                  ) : null;
                })}
              </ul>
            </OptionBox>
          )}
          <Link to={`/options?type=${type}&kind=${kind}`}>
            <p className="noneMsg">
              추가옵션 선택하기 <MdSend />
            </p>
          </Link>
          <FlextCont>
            <Button kind="base">나만의 메뉴등록</Button>
            <Button kind="base">음료 담기</Button>
          </FlextCont>
        </OptionGroup>
      </Contents>
    )
  );
};

const mapStateToProps = ({ product, options }) => ({
  lists: product.lists,
  product: product.product,
  options: options.opt,
});

const mapDispatchToProps = {
  onSetProduct,
  onSetSyrup,
  onSetCount,
  onSetCup,
  onSetSize,
  onSetTotal,
  onSetShot,
  onSetPrice,
  onSetMessages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
