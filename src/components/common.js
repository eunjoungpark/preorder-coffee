import styled from 'styled-components';

/* Layout */
export const Container = styled.section`
  position: relative;
`;

export const Contents = styled.section`
  padding: 20px 10px;
`;

/* Title */
export const PageTitle = styled.h2`
  margin-bottom: 40px;
  color: #000;
  font-size: 26px;
  font-weight: bold;
  .ko {
    display: block;
    font-size: 18px;
    line-height: 1.8;
    color: #333;
  }
`;

export const PageSecnTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
`;

export const SubTitle = styled.h3`
  margin: 50px 0 15px;
  padding: 0 10px 15px 10px;
  color: #333;
  font-size: 20px;
  border-bottom: 1px solid #ababab;
`;

/* Align */
export const AlignCenter = styled.div`
  text-align: center;
`;

export const AlignLeft = styled.div`
  text-align: left;
`;

export const AlignRight = styled.div`
  text-align: right;
`;

/* Flex */
export const FlextCont = styled.div`
  display: flex;
  > * {
    flex: 1;
  }

  button {
    margin-top: 30px;
    padding: 10px;
  }
`;
