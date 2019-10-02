import React from 'react';
import styled from 'styled-components';

const WrapStyle = styled.section`
    width:100%;
    margin:0 auto;
    padding-top:80px;
    border:1px solid #999;
    min-width:320px;
`;

const Wrapper = ({children}) => {
    return <WrapStyle>{children}</WrapStyle>
};

export default Wrapper;