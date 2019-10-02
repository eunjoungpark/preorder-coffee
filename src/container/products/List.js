import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Contents, PageTitle } from '../../components/common';
import Product from '../../components/product/Product';
import { initProduct } from '../../store/product';
import SET_OPTIONS, { initOptions } from '../../store/options';

const List = ({
  lists,
  options,
  initProduct,
  initOptions,
  loadingOptions,
  errorOptions,
}) => {
  useEffect(() => {
    initProduct();
    initOptions();
  }, []);

  if (!lists) {
    return null;
  }

  return (
    <Contents>
      {<PageTitle>메뉴</PageTitle>}
      {!loadingOptions && errorOptions && '에러가 발생했습니다.'}
      {!loadingOptions && <Product lists={lists} />}
    </Contents>
  );
};

const mapStateToProps = ({ product, options, loadings, error }) => ({
  lists: product.lists,
  options: options.opt,
  loadingOptions: loadings[SET_OPTIONS],
  errorOptions: error[SET_OPTIONS],
});

const mapDispatchToProps = { initProduct, initOptions };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);
