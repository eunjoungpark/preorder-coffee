import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import produce from 'immer';
import PropTypes from 'prop-types';
import qs from '../../libs/qs';
import Modal from '../../components/modal/Modal';
import {
  Contents,
  PageTitle,
  SubTitle,
  FlextCont,
} from '../../components/common';
import ItemCount from '../../components/form/itemGroup/ItemCount';
import ItemGroup from '../../components/form/itemGroup/ItemGroup';
import Button from '../../components/form/button/Button';
import RadioBtn from '../../components/form/radio/RadioBtn';
import {
  syrup as koSyrup,
  decaffeine,
  ice,
  milk,
  whipping,
  water,
  onSetShot,
  onSetIce,
  onSetMilk,
  onSetWhipping,
  onSetSyrup,
  onSetWater,
  onSetMessages,
} from '../../store/options';

const ExtraBox = styled.div``;

//옵션 최대값
const MAX = 9;
const Detail = ({
  history,
  location,
  product,
  options,
  onSetShot,
  onSetIce,
  onSetMilk,
  onSetWhipping,
  onSetSyrup,
  onSetWater,
  onSetMessages,
}) => {
  const { type, kind, option } = qs(location);
  const shotForm = useRef(null);
  const syrupForm = useRef(null);
  const iceForm = useRef(null);
  const waterForm = useRef(null);
  const whippingForm = useRef(null);
  const milkForm = useRef(null);
  const [shotNum, setShotNum] = useState(0);
  const [syrupNum, setSyrupNum] = useState({
    mocha: 0,
    hazelnut: 0,
    caramel: 0,
    vanilla: 0,
  });
  const [modalMsg, setModalMsg] = useState('');
  const [alertModal, setAlertModal] = useState(true);

  if (!product) {
    history.push(`/view?type=${type}&kind=${kind}`);
  }

  const backPage = useCallback(() => {
    const url = `/options?type=${type}&kind=${kind}`;
    history.push(url);
  }, []);

  useEffect(() => {
    if (options) {
      setShotNum(options.shot.base + options.shot.count);
      setSyrupNum(
        produce(syrupNum, draft => {
          Object.keys(draft).forEach(prop => {
            draft[prop] = options.syrup[prop].base + options.syrup[prop].count;
          });
        }),
      );
    }
  }, [options]);

  //에스프레소 적용
  const onSetHandlerShot = useCallback(e => {
    const { shotCnt, decaffeineSel } = shotForm.current;
    const { shot } = options;
    const count = shotCnt.value - shot.base;
    const decaffeineVal = decaffeineSel.value;
    let caffeine = { half: false, none: false };

    if (decaffeineVal !== '') {
      caffeine = produce(shot.decaffeine, draft => {
        Object.keys(draft).forEach(prop => {
          draft[prop] = decaffeineVal === prop ? true : false;
        });
      });
      onSetMessages({ decaffeine: decaffeine[decaffeineVal] });
    }

    onSetShot(
      produce(shot, draft => {
        draft.count = count;
        draft.decaffeine = caffeine;
      }),
    );

    if (count !== 0) {
      onSetMessages({ shot: `에스프레소 ${shotCnt.value}` });
    } else {
      onSetMessages({ shot: '' });
    }
    backPage();
    e.preventDefault();
  }, []);

  //에스프레소 수 감소
  const onSetHandlerShotDecrease = useCallback(cnt => {
    if (cnt - 1 <= 0) {
      setAlertModal(false);
      setModalMsg('최소 1개 이상 설정하실 수 있습니다.');
      return null;
    }
    setShotNum(cnt => cnt - 1);
  }, []);

  //에스프레소 수 증가
  const onSetHandlerShotIncrease = useCallback(cnt => {
    if (cnt + 1 > MAX) {
      setAlertModal(false);
      setModalMsg('최대 9개 까지 설정하실 수 있습니다.');
      return null;
    }
    setShotNum(cnt => cnt + 1);
  }, []);

  //시럽 적용
  const onSetHandlerSyrup = useCallback(e => {
    const { syrup } = options;
    const messages = {};
    onSetSyrup(
      produce(syrup, draft => {
        Object.keys(draft).forEach(prop => {
          const count = syrupForm.current[prop].value - draft[prop].base;
          draft[prop].count = count;
          if (count !== 0) {
            messages[
              prop
            ] = `${koSyrup[prop]} ${syrupForm.current[prop].value}`;
          } else {
            messages[prop] = '';
          }
        });
      }),
    );
    onSetMessages({
      mocha: messages.mocha,
      hazelnut: messages.hazelnut,
      caramel: messages.caramel,
      vanilla: messages.vanilla,
    });
    backPage();
    e.preventDefault();
  }, []);

  //시럽 수 감소
  const onSetHandlerSyrupDecrease = useCallback(
    (s, cnt) => {
      const { syrup } = options;
      if (syrup[s].base > 0 && cnt - 1 <= 0) {
        setAlertModal(false);
        setModalMsg('최소 1개 이상 설정하실 수 있습니다.');
        return null;
      }
      if (cnt - 1 < 0) {
        setAlertModal(false);
        setModalMsg('최소 설정 상태입니다.');
        return null;
      }
      setSyrupNum(
        produce(draft => {
          draft[s] = cnt - 1;
        }),
      );
    },
    [syrupNum],
  );

  //시럽 수 증가
  const onSetHandlerSyrupIncrease = useCallback(
    (s, cnt) => {
      if (cnt + 1 > MAX) {
        setAlertModal(false);
        setModalMsg('최대 9개 까지 설정하실 수 있습니다.');
        return null;
      }
      setSyrupNum(
        produce(draft => {
          draft[s] = cnt + 1;
        }),
      );
    },
    [syrupNum],
  );

  //얼음 적용
  const onSetHandlerIce = useCallback(e => {
    const iceValue = iceForm.current.iceSel.value;

    onSetIce(
      produce(options.ice, draft => {
        Object.keys(draft).forEach(prop => {
          draft[prop] = iceValue === prop ? true : false;
        });
      }),
    );
    if (iceValue === 'normal') {
      onSetMessages({ ice: '' });
    } else {
      onSetMessages({ ice: ice[iceValue] });
    }
    backPage();
    e.preventDefault();
  }, []);

  //휘핑 적용
  const onSetHandlerWhipping = useCallback(e => {
    const whippingValue = whippingForm.current.whippingSel.value;
    onSetWhipping(
      produce(options.whipping, draft => {
        Object.keys(draft).forEach(prop => {
          draft[prop] = whippingValue === prop ? true : false;
        });
      }),
    );
    if (whippingValue === 'normal') {
      onSetMessages({ whipping: '' });
    } else {
      onSetMessages({ whipping: whipping[whippingValue] });
    }
    backPage();
    e.preventDefault();
  }, []);

  //우유 적용
  const onSetHandlerMilk = useCallback(e => {
    const { typeSel, volumeSel } = milkForm.current;
    const typeValue = typeSel.value;
    const volumeValue = volumeSel.value;
    const milkVal = { kind: null, volume: null };
    milkVal.kind = produce(options.milk.kind, draft => {
      Object.keys(draft).forEach(prop => {
        draft[prop] = typeValue === prop ? true : false;
      });
    });

    milkVal.volume = produce(options.milk.volume, draft => {
      Object.keys(draft).forEach(prop => {
        draft[prop] = volumeValue === prop ? true : false;
      });
    });

    onSetMilk(milkVal);
    onSetMessages({
      milkKind:
        typeValue === 'milk' ? '' : `우유 종류 : ${milk.kind[typeValue]}`,
      milkVolume:
        volumeValue === 'normal' ? '' : `우유 양 : ${milk.volume[volumeValue]}`,
    });
    backPage();
    e.preventDefault();
  }, []);

  //물 적용
  const onSetHandlerWater = useCallback(e => {
    const waterValue = waterForm.current.waterSel.value;
    onSetWater(
      produce(options.water, draft => {
        Object.keys(draft).forEach(prop => {
          draft[prop] = waterValue === prop ? true : false;
        });
      }),
    );
    if (waterValue === 'normal') {
      onSetMessages({ water: '' });
    } else {
      onSetMessages({ water: water[waterValue] });
    }
    backPage();
    e.preventDefault();
  }, []);

  //모달가림
  const onClickAlertHandler = useCallback(() => {
    setAlertModal(!alertModal);
    setModalMsg('');
  }, [alertModal]);

  return (
    product &&
    options && (
      <Contents>
        <PageTitle>
          <span lang="en">{product.en}</span>
          <span className="ko">{product.ko}</span>
        </PageTitle>
        {option === 'shot' && (
          <form onSubmit={onSetHandlerShot} ref={shotForm} id="shotForm">
            <ExtraBox>
              <SubTitle>커피</SubTitle>
              <ItemCount
                count={shotNum}
                name="shotCnt"
                onDecrease={() => onSetHandlerShotDecrease(shotNum)}
                onIncrease={() => onSetHandlerShotIncrease(shotNum)}
              >
                에스프레소 샷
              </ItemCount>
              <ItemGroup label="디카페인 선택">
                {Object.keys(options.shot.decaffeine).map((prop, index) => {
                  return (
                    <RadioBtn
                      key={prop}
                      type="default"
                      id={`decaffeine${index}`}
                      name="decaffeineSel"
                      value={prop}
                      checked={options.shot.decaffeine[prop]}
                    >
                      {decaffeine[prop]}
                    </RadioBtn>
                  );
                })}
              </ItemGroup>
            </ExtraBox>
            <FlextCont>
              <Button type="submit" kind="base" aria-controls="shotForm">
                적용
              </Button>
            </FlextCont>
          </form>
        )}

        {/*시럽*/}
        {option === 'syrup' &&
          (options.syrup && (
            <form onSubmit={onSetHandlerSyrup} ref={syrupForm} id="syrupForm">
              <ExtraBox>
                <SubTitle>시럽</SubTitle>
                {Object.keys(koSyrup).map(prop => (
                  <ItemCount
                    key={prop}
                    name={prop}
                    count={syrupNum[prop]}
                    onDecrease={() =>
                      onSetHandlerSyrupDecrease(prop, syrupNum[prop])
                    }
                    onIncrease={() =>
                      onSetHandlerSyrupIncrease(prop, syrupNum[prop])
                    }
                  >
                    {koSyrup[prop]}
                  </ItemCount>
                ))}
              </ExtraBox>
              <FlextCont>
                <Button type="submit" kind="base" aria-controls="syrupForm">
                  적용
                </Button>
              </FlextCont>
            </form>
          ))}

        {/*얼음*/}
        {option === 'ice' && (
          <form onSubmit={onSetHandlerIce} ref={iceForm} id="iceForm">
            <ExtraBox>
              <SubTitle>얼음</SubTitle>
              <ItemGroup label="얼음 양">
                {Object.keys(options.ice).map((prop, index) => (
                  <RadioBtn
                    type="default"
                    id={`ice${index}`}
                    name="iceSel"
                    value={prop}
                    checked={options.ice[prop]}
                    key={prop}
                  >
                    {ice[prop]}
                  </RadioBtn>
                ))}
              </ItemGroup>
            </ExtraBox>
            <FlextCont>
              <Button type="submit" kind="base" aria-controls="iceForm">
                적용
              </Button>
            </FlextCont>
          </form>
        )}

        {/*물*/}
        {option === 'water' && (
          <form onSubmit={onSetHandlerWater} ref={waterForm} id="waterForm">
            <ExtraBox>
              <SubTitle>물</SubTitle>
              <ItemGroup label="물 양">
                {Object.keys(options.water).map((prop, index) => (
                  <RadioBtn
                    type="default"
                    id={`water${index}`}
                    name="waterSel"
                    checked={options.water[prop]}
                    key={prop}
                    value={prop}
                  >
                    {water[prop]}
                  </RadioBtn>
                ))}
              </ItemGroup>
            </ExtraBox>
            <FlextCont>
              <Button type="submit" kind="base" aria-controls="waterForm">
                적용
              </Button>
            </FlextCont>
          </form>
        )}

        {/*휘핑*/}
        {option === 'whipping' && (
          <form
            onSubmit={onSetHandlerWhipping}
            ref={whippingForm}
            id="whippingForm"
          >
            <ExtraBox>
              <SubTitle>휘핑</SubTitle>
              <ItemGroup label="휘핑크림 양">
                {Object.keys(options.ice).map((prop, index) => (
                  <RadioBtn
                    type="default"
                    id={`whipping${index}`}
                    checked={options.ice[prop]}
                    name="whippingSel"
                    key={prop}
                    value={prop}
                  >
                    {whipping[prop]}
                  </RadioBtn>
                ))}
              </ItemGroup>
            </ExtraBox>
            <FlextCont>
              <Button type="submit" kind="base" aria-controls="whippingForm">
                적용
              </Button>
            </FlextCont>
          </form>
        )}

        {/*우유*/}
        {option === 'milk' && (
          <form onSubmit={onSetHandlerMilk} ref={milkForm} id="milkForm">
            <ExtraBox>
              <SubTitle>우유</SubTitle>
              <ItemGroup label="우유 종류">
                {Object.keys(options.milk.kind).map((prop, index) => (
                  <RadioBtn
                    type="default"
                    id={`milkType${index}`}
                    name="typeSel"
                    checked={options.milk.kind[prop]}
                    key={prop}
                    value={prop}
                  >
                    {milk.kind[prop]}
                  </RadioBtn>
                ))}
              </ItemGroup>
              <ItemGroup label="우유 양">
                {Object.keys(options.milk.volume).map((prop, index) => (
                  <RadioBtn
                    type="default"
                    id={`milkVolume${index}`}
                    name="volumeSel"
                    checked={options.milk.volume[prop]}
                    key={prop}
                    value={prop}
                  >
                    {milk.volume[prop]}
                  </RadioBtn>
                ))}
              </ItemGroup>
            </ExtraBox>
            <FlextCont>
              <Button type="submit" kind="base" aria-controls="milkForm">
                적용
              </Button>
            </FlextCont>
          </form>
        )}
        {/* alert메시지 */}
        <Modal shown={alertModal} onClickHandler={onClickAlertHandler}>
          {modalMsg}
          <br />
          <Button kind="default" onClick={onClickAlertHandler}>
            확인
          </Button>
        </Modal>
      </Contents>
    )
  );
};

Detail.propTypes = {
  product: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  onSetShot: PropTypes.func.isRequired,
  onSetIce: PropTypes.func.isRequired,
  onSetMilk: PropTypes.func.isRequired,
  onSetWhipping: PropTypes.func.isRequired,
  onSetSyrup: PropTypes.func.isRequired,
  onSetWater: PropTypes.func.isRequired,
  onSetMessages: PropTypes.func.isRequired,
};

const mapStateToProps = ({ product, options }) => ({
  product: product.product,
  options: options,
});

const mapDispatchToProps = {
  onSetShot,
  onSetIce,
  onSetMilk,
  onSetWhipping,
  onSetSyrup,
  onSetWater,
  onSetMessages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Detail);
