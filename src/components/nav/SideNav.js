import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SideNav = styled.nav`
    position : fixed;
    top:80px;
    left:0;
    bottom:0;
    width : 90%;
    max-width : 440px
    padding-top:50px;
    background-color:#3e4759;
    z-index:99;
    transform : translateX(-100%);
    li {
        a{
            display:block;
            padding:20px;
            font-size:20px;
            color:#fff;
            &:hover {
                background-color:#2f3745;
            }
        }
    }
`;
const Lnb = () => {
  return (
    <SideNav>
      <ul>
        <li>
          <NavLink to="/">홈</NavLink>
        </li>
        <li>
          <NavLink to="/view">상세</NavLink>
        </li>
        <li>
          <NavLink to="/options">옵션</NavLink>
        </li>
        <li>
          <NavLink to="/details">추가옵션</NavLink>
        </li>
        <li>
          <NavLink to="">나만의 메뉴</NavLink>
        </li>
        <li>
          <NavLink to="">주문 내역</NavLink>
        </li>
        <li>
          <NavLink to="">로그인</NavLink>
        </li>
      </ul>
    </SideNav>
  );
};

export default React.memo(Lnb);
