import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Backdrop from '../../components/backdrop/Backdrop';
import Lnb from '../../components/nav/SideNav';
import { MdClose, MdShoppingCart } from 'react-icons/md';
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
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  vertical-align: top;
  .open {
    padding:0 6px;
    transform: rotate(0deg);
    transition: all 1s ease;  
    span {
      display: block;
      height: 3px;
      margin: 6px 0;
      background-color: #fff;
    }
  }
  .close {
    position:absolute;
    left:0;
    top:0;
    width:0;
    height:0;
    color:#fff;
    font-size:40px
    transform: rotate(90deg);
    opacity: 0;
    transition: all 1s ease;
  }
  &.navAni {
    .open {
      transform: rotate(90deg);
      width:0;
      height:0;
      opacity: 0;
    }
    .close {
      width:auto;
      height:auto;
      transform: rotate(0);
      opacity: 1;
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
        <TriggerNav onClick={toggleNav} className={isAni ? 'navAni' : ''}>
          <div className="open">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <MdClose className="close" />
        </TriggerNav>
        <h1>
          <Link to="/" className="logo" onClick={onChangePageHandler}>
            <LogoImg src={logo} />
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
      <Lnb isAni={isAni} onChangePageHandler={onChangePageHandler} />
    </>
  );
};

Header.propTypes = {
  cntWish: PropTypes.number,
  userId: PropTypes.string,
};

export default React.memo(Header);
