import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { removeAuth } from '../../store/auth';
import { initOptions } from '../../store/options';
import { initMenu } from '../../store/mymenu';
import { emptyWishList } from '../../store/wish';
import { emptyMenu } from '../../store/mymenu';
const SideNav = styled.nav`
    position : fixed;
    top:60px;
    left:0;
    bottom:0;
    width : 80%;
    max-width : 440px
    padding-top:50px;
    background-color:#3e4759;
    z-index:99;
    transform : translateX(-100%);
    transition:transform 0.5s ease;
    &.navAni {
      transform : translateX(0);
    }
    
    li {
        a{
            display:block;
            padding:15px 20px;
            font-size:18px;
            color:#fff;
            &:hover {
                background-color:#2f3745;
            }
        }
    }
`;
const Lnb = ({
  localId,
  isAni,
  onChangePageHandler,
  removeAuth,
  initOptions,
  history,
  emptyWishList,
  emptyMenu,
}) => {
  //로그아웃
  const onLogoutHandler = useCallback(() => {
    initOptions();
    removeAuth();
    onChangePageHandler();
    emptyWishList();
    emptyMenu();
    history.push('/');
  }, []);
  return (
    <SideNav className={isAni ? 'navAni' : ''}>
      <ul>
        {localId && (
          <>
            <li>
              <NavLink to="/" onClick={onChangePageHandler}>
                홈
              </NavLink>
            </li>
            <li>
              <NavLink to="/mymenu" onClick={onChangePageHandler}>
                나만의 메뉴
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" onClick={onChangePageHandler}>
                주문 내역
              </NavLink>
            </li>
            <li>
              <NavLink to="/logout" onClick={onLogoutHandler}>
                로그아웃
              </NavLink>
            </li>
          </>
        )}
        {!localId && (
          <>
            <li>
              <NavLink to="/signin" onClick={onChangePageHandler}>
                로그인
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" onClick={onChangePageHandler}>
                회원가입
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </SideNav>
  );
};

Lnb.propTypes = {
  localId: PropTypes.string,
  isAni: PropTypes.bool,
  onChangePageHandler: PropTypes.func,
  removeAuth: PropTypes.func,
  initOptions: PropTypes.func,
  emptyWishList: PropTypes.func,
  emptyMenu: PropTypes.func,
};

const mapStateToProps = ({ auth }) => ({
  localId: auth.localId,
});

const mapDispatchToProps = {
  removeAuth,
  initOptions,
  initMenu,
  emptyWishList,
  emptyMenu,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Lnb));
