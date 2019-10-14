import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from '../../libs/qs';
import produce from 'immer';
import { MdSend } from 'react-icons/md';
import styled from 'styled-components';
import Button from '../../components/form/button/Button';
import RadioBtn from '../../components/form/radio/RadioBtn';
import Input from '../../components/form/input/Input';
import {
  Contents,
  PageTitle,
  SubTitle,
  FlextCont,
} from '../../components/common';
import ItemCount from '../../components/form/itemGroup/ItemCount';
import ItemGroup from '../../components/form/itemGroup/ItemGroup';
import Modal from '../../components/modal/Modal';
import Loading from '../../components/loading/Loading';
import * as productsImage from '../../images/products';
import { commas } from '../../libs/util';
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
  onSetType,
  cups,
  types,
} from '../../store/options';
import { addWish, ADD_WISH } from '../../store/wish';
import { addMenu, ADD_MY_MENU } from '../../store/mymenu';
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

const OptionGroup = styled.section`
  button {
    margin: 30px 5px 0;
    padding: 10px;
  }
  .noneMsg {
    color: #000;
    text-align: center;
    line-height: 1.2;
    font-size: 17px;
    svg {
      vertical-align: top;
      font-size: 20px;
    }
  }
`;

const OptionBox = styled.div`
  text-align: left;
  ul {
    margin-bottom: 15px;
    li {
      color: #8c6046;
      padding: 0 5px;
      font-size: 16px;
      line-height: 1.3;
    }
  }
  fieldset {
    padding: 0 5px;
    label {
      display: block;
      margin-bottom: 10px;
      font-size: 12px;
    }
    input {
      line-height: 24px;
      padding: 5px;
      width: 100%;
    }
  }
`;

//음료주문 최대값
const MAX = 20;
const View = ({
  history,
  location,
  product,
  options,
  auth,
  onSetProduct,
  onSetSyrup,
  onSetCount,
  onSetCup,
  onSetSize,
  onSetTotal,
  onSetShot,
  onSetPrice,
  onSetType,
  onSetMessages,
  addWish,
  addMenu,
  loadingAddWish,
  loadingAddMenu,
  emptyLoading,
}) => {
  const { type, kind } = qs(location);
  const s = kind === 'espresso' ? 'Solo' : 'Tall';
  const [hasMsg, setHasMsg] = useState(false);
  const [shown, setShown] = useState(true);
  const [menuName, setMenuName] = useState('');

  useEffect(() => {
    if (!product) {
      onSetProduct({ type, kind });
    }
  }, []);

  useEffect(() => {
    if (options.size === '') {
      onSetSize(s);
    } else if (options && product) {
      const { price, sizes } = product;
      const { size, shot, syrup, messages } = options;

      //나만의 메뉴명
      setMenuName(product.ko);

      //음료 타입
      onSetType(type);

      //음료 단가
      onSetPrice(price + sizes[size].extra);

      //에스프레소 수
      onSetShot(
        produce(shot, draft => {
          draft.base = sizes[size].shot;
        }),
      );

      //음료 시럽
      if (sizes[size]['syrup']) {
        Object.keys(sizes[size].syrup).forEach(sp => {
          onSetSyrup(
            produce(syrup, draft => {
              draft[sp].base = sizes[size].syrup[sp];
            }),
          );
        });
      }

      //메세지 설정
      setHasMsg(
        Object.keys(messages).every(key => {
          return messages[key] === '';
        }),
      );
    }
  }, [product, options]);

  //합계 계산
  const total = useMemo(() => {
    if (product && options) {
      const price = options.size
        ? product.price + product.sizes[options.size].extra
        : product.price + product.sizes[s].extra;
      const shotTotal = options.shot.count * options.shot.extra;
      const mochaTotal = options.syrup.mocha.count * options.syrup.mocha.extra;
      const caramelTotal =
        options.syrup.caramel.count * options.syrup.caramel.extra;
      const hazelnutTotal =
        options.syrup.hazelnut.count * options.syrup.hazelnut.extra;
      const vanillaTotal =
        options.syrup.vanilla.count * options.syrup.vanilla.extra;

      onSetTotal(
        (price +
          shotTotal +
          mochaTotal +
          caramelTotal +
          hazelnutTotal +
          vanillaTotal) *
          options.count,
      );
      return (
        (price +
          shotTotal +
          mochaTotal +
          caramelTotal +
          hazelnutTotal +
          vanillaTotal) *
        options.count
      );
    }
  }, [product, options]);

  useEffect(() => {
    return () => emptyLoading();
  }, []);

  //음료타입 변경
  const onSetHandlerType = useCallback(coffeeType => {
    onSetType(coffeeType);
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

  //모달
  const onClickShownHandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else {
      setShown(!shown);
    }
  }, [shown]);

  //위시 리스트 담기
  const onClickWishhandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else {
      for (let i = 0; i < options.count; i++) {
        addWish({
          token: auth.idToken,
          userId: auth.localId,
          wish: {
            ...options,
            userId: auth.localId,
            nickname: '',
            ko: product.ko,
            en: product.en,
            count: 1,
            checked: true,
            total: options.total / options.count,
          },
        });
      }
    }
  }, [auth, product, options]);

  //나만의 메뉴명
  const onChangeMenuHandler = useCallback(e => {
    const { value } = e.target;
    setMenuName(value);
  }, []);

  //나만의 음료등록
  const onClickMyMenuHandler = useCallback(() => {
    if (auth.localId === null) {
      alert('로그인 먼저해주세요.');
    } else {
      addMenu({
        token: auth.idToken,
        userId: auth.localId,
        menu: {
          ...options,
          userId: auth.localId,
          nickname: menuName,
          ko: product.ko,
          en: product.en,
          total: options.total / options.count,
          count: 1,
          image: `${type}_${kind}`,
        },
      });
      setShown(!shown);
    }
  }, [menuName, shown]);

  return (
    product &&
    options && (
      <Contents>
        <PageTitle ko={product.ko}>{product.en}</PageTitle>
        <form>
          <ItemBase className="clear">
            <div className="itemImg">
              <img
                src={productsImage[`${type}_${kind}`]}
                width="150"
                alt={product.ko}
              />
            </div>
            <div className="itemInfo">
              <p className="ko">{product.ko}</p>
              <p className="price">{commas(total)}</p>
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
          <Link to={`/options?type=${type}&kind=${kind}`}>
            <p className="noneMsg">
              옵션선택 하러가기 <MdSend />
            </p>
          </Link>
          <FlextCont>
            <Button kind="base" onClick={onClickShownHandler}>
              나만의 메뉴등록
            </Button>
            <Button kind="base" onClick={onClickWishhandler}>
              음료 담기
            </Button>
          </FlextCont>
        </OptionGroup>
        {(loadingAddWish || loadingAddMenu) && <Loading />}
        {/* 나만의 메뉴 등록 모달 */}
        <Modal shown={shown}>
          <h1>나만의 메뉴 등록</h1>
          {!hasMsg && (
            <OptionBox>
              <ul>
                <li>
                  {types[options.type]}/{options.size}/{cups[options.cup]}
                </li>
                <li>
                  {Object.keys(options.messages).map(option => {
                    return options.messages[option] !== '' &&
                      'cup size'.indexOf(option) < 0
                      ? options.messages[option] + '/'
                      : null;
                  })}
                </li>
              </ul>
              <Input
                type="text"
                id="myName"
                label="나만의 음료명"
                value={menuName}
                placeholder="나만의 음료에 이름을 붙여보세요"
                changed={onChangeMenuHandler}
              />
            </OptionBox>
          )}
          <FlextCont>
            <Button kind="gray" type="cancel" onClick={onClickShownHandler}>
              취소
            </Button>
            <Button kind="dark" onClick={onClickMyMenuHandler}>
              확인
            </Button>
          </FlextCont>
        </Modal>
        {/* 나만의 음료 담기완료 모달 */}
        {loadingAddMenu === false && <Modal>나만의 음료를 저장 했습니다</Modal>}
        {/* 위시리스트 담기완료 모달 */}
        {loadingAddWish === false && <Modal>담기를 완료 했습니다</Modal>}
      </Contents>
    )
  );
};

const mapStateToProps = ({ auth, product, options, loadings }) => ({
  product: product.product,
  options: options,
  auth: auth,
  loadingAddWish: loadings[ADD_WISH],
  loadingAddMenu: loadings[ADD_MY_MENU],
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
  onSetType,
  onSetMessages,
  addWish,
  addMenu,
  emptyLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
