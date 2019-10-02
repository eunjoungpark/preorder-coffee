import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import './css/base.scss';
import Wrapper from './layout/Wrapper';
import { Container } from './components/common';
import Header from './components/header/Header';
import Lnb from './components/nav/SideNav.js';
import Loading from './components/loading/Loading';
import List from './container/products/List';
import View from './container/products/View';
import { SET_PRODUCTS, initProducts } from './store/product';
import Options from './container/products/Options';
import Details from './container/products/Details';

const App = ({
  lists,
  options,
  loadingProducts,
  errorProducts,
  initProducts,
}) => {
  useEffect(() => {
    initProducts();
  }, []);
  return (
    <Wrapper>
      <BrowserRouter>
        <Header />
        <Container>
          <Lnb />
          {!loadingProducts && errorProducts && '에러가 발생하였습니다.'}
          {loadingProducts && <Loading />}
          {lists && (
            <>
              <Route path="/" exact component={List} />
              <Route path="/view" component={View} />
              <Route path="/options" component={Options} />
              <Route path="/details" component={Details} />
            </>
          )}
        </Container>
      </BrowserRouter>
    </Wrapper>
  );
};

const mapStateToProps = ({ product, options, loadings, error }) => ({
  lists: product.lists,
  options: options.opt,
  loadingProducts: loadings[SET_PRODUCTS],
  errorProducts: error[SET_PRODUCTS],
});

const mapDispatchToProps = { initProducts };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
