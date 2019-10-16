import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AriaModal from 'react-aria-modal';
import './css/base.scss';
import ErrorHandler from './errorHandler/ErrorHandler';
import Wrapper from './layout/Wrapper';
import { Container, FlextCont, ModalContents } from './components/common';
import Header from './components/header/Header';
import Curtain from './container/Curtain';
import List from './container/products/List';
import View from './container/products/View';
import Options from './container/products/Options';
import Details from './container/products/Details';
import MyMenu from './container/myPage/MyMenu';
import MyMenuPay from './container/myPage/MyMenuPay';
import Orders from './container/myPage/Orders';
import SignUp from './container/member/SignUp';
import SignIn from './container/member/SignIn';
import Wish from './container/myPage/Wish';
import Store from './container/myPage/Store';
import Modal from './components/modal/Modal';
import Button from './components/form/button/Button';
import { SET_PRODUCTS, initProducts } from './store/product';
import { removeAuth, accessAuth } from './store/auth';
import { initWishList, emptyWishList } from './store/wish';
import { initOptions } from './store/options';
import { initMenu, emptyMenu } from './store/mymenu';

const App = ({
  lists,
  auth,
  wish,
  loadingProducts,
  initProducts,
  initOptions,
  removeAuth,
  accessAuth,
  initWishList,
  initMenu,
  emptyMenu,
  emptyWishList,
}) => {
  const [cntWish, setCntWish] = useState(0);
  const [appear, setAppear] = useState(false);
  const [reLogin, setReLogin] = useState(true);
  const [modalMsg, setModalMsg] = useState('');

  //리프래시에도 로그인상태 유지
  useEffect(() => {
    if (localStorage.getItem('localId')) {
      const currentExpire =
        new Date(localStorage.getItem('expiresDate')).getTime() -
        new Date().getTime();
      if (currentExpire > 0) {
        accessAuth(currentExpire); //로그인상태 연장
      } else {
        removeAuth(); //로그아웃
        initOptions(); //옵션 초기화
        emptyMenu(); //나만의 메뉴 초기화
        emptyWishList(); //위시리스트 초기화
      }
    }
  }, []);

  //제품 및 옵션 페치
  useEffect(() => {
    initProducts();
    initOptions();
  }, []);

  useEffect(() => {
    if (auth.localId) {
      //위리리스트 가져옴
      initWishList({
        token: auth.idToken,
        userId: auth.localId,
      });

      //나만의 메뉴 가져옴
      initMenu({
        token: auth.idToken,
        userId: auth.localId,
      });
    }
  }, [auth.localId]);

  //세션유지 질의
  useEffect(() => {
    const currentExpire =
      new Date(auth.expiresDate).getTime() - new Date().getTime();
    if (currentExpire > 0) {
      setTimeout(() => {
        setAppear(true);
      }, currentExpire);
    }
  }, [auth.expiresDate]);

  //위시리스트 상품갯수
  useEffect(() => {
    if (wish) {
      setCntWish(Object.keys(wish).length);
    }
  }, [wish]);

  //세션유지 결정
  const onClickSessionHandler = useCallback(
    result => {
      const expectExpire =
        new Date(auth.expiresDate).getTime() - new Date().getTime() + 600000;

      if (expectExpire > 0 && result) {
        accessAuth(600000); //유효시간 연장(10분)
      } else {
        if (expectExpire < 0 && result) {
          setReLogin(false);
          setModalMsg('장시간 사용하지 않았습니다.<br />다시 로그인 해주세요.');
        }

        removeAuth(); //로그아웃
        initOptions(); //옵션 초기화
        emptyMenu(); //나만의 메뉴 초기화
        emptyWishList(); //위시리스트 초기화
      }
      setAppear(false);
    },
    [auth.expiresDate],
  );

  const onClickReLoginHandler = useCallback(() => {
    setReLogin(false);
    setModalMsg('');
  }, []);

  return (
    <Wrapper>
      <BrowserRouter>
        {loadingProducts && <Curtain />}
        {lists && (
          <>
            <Header cntWish={cntWish} userId={auth.localId} />
            <Container>
              {appear && (
                <AriaModal
                  onExit={() => onClickSessionHandler(false)}
                  titleId="auth_delay_modal"
                >
                  <ModalContents>
                    <h1 id="auth_delay_modal">로그인을 연장하시겠습니까?</h1>
                    <p>
                      로그인 유효시간이 만료되었습니다. 로그인을
                      연장하시겠습니까?
                    </p>
                    <FlextCont>
                      <Button
                        kind="gray"
                        onClick={() => onClickSessionHandler(false)}
                      >
                        취소
                      </Button>
                      <Button
                        kind="dark"
                        onClick={() => onClickSessionHandler(true)}
                      >
                        연장하기
                      </Button>
                    </FlextCont>
                  </ModalContents>
                </AriaModal>
              )}
              <Modal
                shown={reLogin}
                role="alert"
                onClickHandler={onClickReLoginHandler}
                aria-live="assertive"
              >
                {modalMsg}
                <Button kind="default" onClick={onClickReLoginHandler}>
                  확인
                </Button>
              </Modal>
              <Switch>
                <Route
                  path="/"
                  exact
                  render={prop => <List {...prop} lists={lists} />}
                />
                <Route
                  path="/view"
                  render={prop => <View {...prop} lists={lists} />}
                />
                <Route path="/options" component={Options} />
                <Route path="/details" component={Details} />
                <Route path="/mymenu" exact component={MyMenu} />
                <Route path="/mymenu/pay" component={MyMenuPay} />
                <Route path="/orders" component={Orders} />
                <Route path="/wish" component={Wish} />
                <Route path="/store" component={Store} />
                <Route path="/signup" component={SignUp} />
                <Route path="/signin" component={SignIn} />
                <Redirect to="/" />
              </Switch>
            </Container>
          </>
        )}
      </BrowserRouter>
    </Wrapper>
  );
};

const mapStateToProps = ({ product, loadings, auth, wish }) => ({
  lists: product.lists,
  loadingProducts: loadings[SET_PRODUCTS],
  auth,
  wish,
});

const mapDispatchToProps = {
  initProducts,
  initOptions,
  removeAuth,
  accessAuth,
  initWishList,
  initMenu,
  emptyMenu,
  emptyWishList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ErrorHandler(App));
