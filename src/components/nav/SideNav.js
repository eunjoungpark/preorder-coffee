import React, { useCallback, useEffect, useRef } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
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

const TriggerNav = styled.button`
  display: ${props => (props.isAni ? 'block' : 'none')};
  position: absolute;
  top: -50px;
  left: 10px;
  width: 40px;
  height: 40px;
  vertical-align: top;
  .close {
    color: #fff;
    font-size: 40px;
  }
`;

const Lnb = ({
  localId,
  isAni,
  onChangePageHandler,
  onToggleHandler,
  removeAuth,
  initOptions,
  history,
  emptyWishList,
  emptyMenu,
}) => {
  const nav = useRef(null);

  useEffect(() => {
    if (isAni) {
      nav.current.tabIndex = 0;
      nav.current.focus();
    } else {
      nav.current.tabIndex = -1;
      nav.current.blur();
    }
  }, [isAni]);

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
    <SideNav className={isAni ? 'navAni' : ''} tabIndex="-1" ref={nav}>
      <h2 className="hidden">메인 메뉴</h2>
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
              <NavLink to="/" onClick={onChangePageHandler}>
                홈
              </NavLink>
            </li>
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
      <TriggerNav
        aria-label="메뉴 닫기"
        isAni={isAni}
        onClick={onToggleHandler}
      >
        <MdClose className="close" />
      </TriggerNav>
    </SideNav>
  );
};

Lnb.propTypes = {
  localId: PropTypes.string,
  isAni: PropTypes.bool,
  onChangePageHandler: PropTypes.func,
  onToggleHandler: PropTypes.func,
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
