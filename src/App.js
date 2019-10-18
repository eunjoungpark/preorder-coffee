import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './css/base.scss';
import { Container, FlextCont, ModalContents } from './components/common';
import AriaModal from 'react-aria-modal';
import ErrorHandler from './errorHandler/ErrorHandler';
import Wrapper from './layout/Wrapper';
import Header from './components/header/Header';
import Curtain from './components/loading/Curtain';
import Loading from './components/loading/Loading';
import Modal from './components/modal/Modal';
import Button from './components/form/button/Button';
import { SET_PRODUCTS, initProducts } from './store/product';
import { removeAuth, accessAuth } from './store/auth';
import { initWishList, emptyWishList } from './store/wish';
import { initOptions } from './store/options';
import { initMenu, emptyMenu } from './store/mymenu';
import List from './container/products/List';
const View = React.lazy(() => import('./container/products/View'));
const Options = React.lazy(() => import('./container/products/Options'));
const Details = React.lazy(() => import('./container/products/Details'));
const MyMenu = React.lazy(() => import('./container/myPage/MyMenu'));
const MyMenuPay = React.lazy(() => import('./container/myPage/MyMenuPay'));
const Orders = React.lazy(() => import('./container/myPage/Orders'));
const SignUp = React.lazy(() => import('./container/member/SignUp'));
const SignIn = React.lazy(() => import('./container/member/SignIn'));
const Wish = React.lazy(() => import('./container/myPage/Wish'));
const Store = React.lazy(() => import('./container/myPage/Store'));

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
  const [alertModal, setAlertModal] = useState(true);
  const [modalMsg, setModalMsg] = useState('');

  let route = (
    <Switch>
      <Route path="/view" render={prop => <View {...prop} lists={lists} />} />
      <Route path="/options" component={Options} />
      <Route path="/details" component={Details} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Redirect to="/" />
    </Switch>
  );

  if (auth.localId) {
    route = (
      <Switch>
        <Route path="/view" render={prop => <View {...prop} lists={lists} />} />
        <Route path="/options" component={Options} />
        <Route path="/details" component={Details} />
        <Route path="/mymenu" exact component={MyMenu} />
        <Route path="/mymenu/pay" component={MyMenuPay} />
        <Route path="/orders" component={Orders} />
        <Route path="/wish" component={Wish} />
        <Route path="/store" component={Store} />
        <Redirect to="/" />
      </Switch>
    );
  }

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
    if (auth.success) {
      setAlertModal(false);
      setModalMsg('로그인 되었습니다.');
    } else if (auth.success === false) {
      setAlertModal(false);
      setModalMsg('로그아웃 되었습니다.');
    }
  }, [auth.success]);

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
    } else {
      setCntWish(0);
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
          setAlertModal(false);
          setModalMsg('장시간 사용하지 않았습니다. 다시 로그인 해주세요.');
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

  const onClickAlertHandler = useCallback(() => {
    setAlertModal(!alertModal);
    setModalMsg('');
  }, [alertModal]);

  return (
    <Wrapper>
      <BrowserRouter>
        {loadingProducts && <Curtain />}
        {lists && (
          <>
            <Header cntWish={cntWish} userId={auth.localId} />
            <Container>
              <Route
                path="/"
                exact
                render={prop => <List {...prop} lists={lists} />}
              />
              <Suspense fallback={<Loading />}>{route}</Suspense>
              {appear && (
                <AriaModal
                  onExit={() => onClickSessionHandler(false)}
                  titleId="auth_delay_modal"
                >
                  {/* 로그인 연장 모달 */}
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
              {/* 기타 모달 */}
              <Modal shown={alertModal} onClickHandler={onClickAlertHandler}>
                {modalMsg}
                <br />
                <Button kind="default" onClick={onClickAlertHandler}>
                  확인
                </Button>
              </Modal>
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
