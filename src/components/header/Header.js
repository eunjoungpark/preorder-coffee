import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

const HeadStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  padding: 15px;
  background-color: #3e4759;
  text-align: center;
  border-bottom: 1px solid #000;
  a.logo {
    display: inline-block;
    line-height: 46px;
    font-size: 30px;
    color: #fff;
  }
  z-index: 99;
`;

const TriggerNav = styled.button`
  position: absolute;
  left: 15px;
  top: 15px;
  width: 30px;
  height: 50px;
  vertical-align: top;
  span {
    display: block;
    height: 3px;
    margin: 8px 0;
    background-color: #fff;
  }
`;

const LogoImg = styled.img`
  width: 35px;
  margin-right: 20px;
  vertical-align: middle;
`;

const Header = () => {
  return (
    <HeadStyle>
      <TriggerNav>
        <span></span>
        <span></span>
        <span></span>
      </TriggerNav>
      <h1>
        <Link to="/" className="logo">
          <LogoImg src={logo} />
          Coffee Shop
        </Link>
      </h1>
    </HeadStyle>
  );
};

export default React.memo(Header);
