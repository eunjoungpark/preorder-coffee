import React from 'react';
import styled from 'styled-components';
import curtain01 from '../assets/curtain/curtain01.png';
import curtain02 from '../assets/curtain/curtain02.png';
import curtain03 from '../assets/curtain/curtain03.png';
import curtain04 from '../assets/curtain/curtain04.png';
import curtain05 from '../assets/curtain/curtain05.png';
import curtain06 from '../assets/curtain/curtain06.png';
const CurtainContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3e4759;
  z-index: 999;
  .curtainBox {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 128px;
    height: 128px;
    transform: translate(-50%, -50%);
    animation-name: curtainAni;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @keyframes curtainAni {
    0% {
      background: url(${curtain01}) 0 0 no-repeat;
    }
    20% {
      background: url(${curtain02}) 0 0 no-repeat;
    }
    40% {
      background: url(${curtain03}) 0 0 no-repeat;
    }
    60% {
      background: url(${curtain04}) 0 0 no-repeat;
    }
    80% {
      background: url(${curtain05}) 0 0 no-repeat;
    }
    100% {
      background: url(${curtain06}) 0 0 no-repeat;
    }
  }
`;

const Curtain = () => {
  return (
    <CurtainContainer>
      <div className="curtainBox"></div>
      <div className="hidden">잠시만 기다려주세요.</div>
    </CurtainContainer>
  );
};

export default Curtain;
