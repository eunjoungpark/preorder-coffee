import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Backdrop from '../../components/backdrop/Backdrop';
import Lnb from '../../components/nav/SideNav';
import { MdShoppingCart } from 'react-icons/md';
import logo from '../../assets/logo.png';

const HeadStyle = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding:10px 15px;
  background-color: #3e4759;
  text-align: center;
  border-bottom: 1px solid #000;
  a.logo {
    display: inline-block;
    line-height: 36px;
    font-size: 24px;
    color: #fff;
  }
  a.cart {
    position: absolute;
    top: 15px;
    right: 24px;
    font-size: 30px;
    color: #fff;
    .count {
      position: absolute;
      top: -10px;
      right: -15px;
      padding:0;
      background-color: #8c6046;
      border-radius: 15px;
      font-size: 16px;
      padding: 5px 10px;
      line-height: 1;
      overflow:hidden;
      zoom:0;
      &.isAni {
        zoom:1.5;
        transition:all 0.2s ease;
       }
      }
    }
  }
  z-index: 99;
`;

const TriggerNav = styled.button`
  display: ${props => (props.isAni ? 'none' : 'block')};
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  vertical-align: top;
  .open {
    padding: 0 6px;
    span {
      display: block;
      height: 3px;
      margin: 6px 0;
      background-color: #fff;
    }
  }
`;

const LogoImg = styled.img`
  width: 28px;
  margin-right: 20px;
  vertical-align: top;
`;

const Header = ({ cntWish, userId }) => {
  const [isAni, setIsAni] = useState(false);
  const wishRef = useRef(null);
  const toggleNav = useCallback(() => {
    setIsAni(!isAni);
  }, [isAni]);

  const onChangePageHandler = useCallback(() => {
    setIsAni(false);
  }, [isAni]);

  useEffect(() => {
    if (cntWish > 0 && wishRef) {
      wishRef.current.className = 'count isAni';
      setTimeout(() => {
        wishRef.current.className = 'count';
      }, 100);
    }
  }, [cntWish, wishRef]);
  return (
    <>
      <HeadStyle>
        <TriggerNav onClick={toggleNav} aria-label="메뉴 열기" isAni={isAni}>
          <div className="open">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </TriggerNav>
        <h1>
          <Link to="/" className="logo" onClick={onChangePageHandler} lang="en">
            <LogoImg src={logo} alt="" />
            Coffee Shop
          </Link>
        </h1>
        {userId && (
          <Link to="/wish" className="cart" onClick={onChangePageHandler}>
            <MdShoppingCart />
            {cntWish > 0 && (
              <span className="count" ref={wishRef}>
                {cntWish}
              </span>
            )}
          </Link>
        )}
      </HeadStyle>
      {isAni && <Backdrop onClick={onChangePageHandler} />}
      <Lnb
        isAni={isAni}
        onChangePageHandler={onChangePageHandler}
        onToggleHandler={toggleNav}
      />
    </>
  );
};

Header.propTypes = {
  cntWish: PropTypes.number,
  userId: PropTypes.string,
};

export default React.memo(Header);
